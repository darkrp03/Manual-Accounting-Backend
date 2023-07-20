import { injectable } from "inversify";
import { dynamoDB } from "../app";
import { validateSchema } from "../functions";
import { addVisitorSchema, updateVisitorSchema } from "../schemas";
import { generateExpression } from "../functions";
import { Visitor } from "../models";

@injectable()
export class VisitorService {
    private readonly visitorTable = process.env.VISITORS_TABLE as string;

    async addUser(username: string) {
        const params = {
            TableName: this.visitorTable,
            Item: {
                username: username,
                visitors: []
            }
        }

        await dynamoDB.put(params).promise();
    }

    async getVisitors() {
        const params = {
            TableName: this.visitorTable
        }
    
        const data = await dynamoDB.scan(params).promise();

        return data.Items;
    }

    async getVisitor(id: string) {
        const params = {
            TableName: this.visitorTable,
            Key: {
                visitorId: {
                    S: id
                }
            }
        }
    
        const visitor = await dynamoDB.get(params).promise();
    
        return visitor.Item;
    }

    async tryToAddVisitor(body: any): Promise<boolean> {
        const isValidateSchema = validateSchema(body, addVisitorSchema);

        if (!isValidateSchema) {
            return false;
        }
    
        const newVisitor = {
            visitorId: {
                S: body["visitors"]["visitorId"]
            },
            visitorName: {
                S: body["visitorName"]
            },
            visitorSurname: {
                S: body["visitorSurname"]
            },
            visitorEntryTime: {
                S: body["visitorEntryTime"]
            }
        }
    
        const params = {
            TableName: this.visitorTable,
            Item: newVisitor
        }
    
        await dynamoDB.put(params).promise();
    
        return true;
    }

    async deleteVisitor(id: string) {
        const params = {
            TableName: this.visitorTable,
            Key: {
                visitorId: {
                    S: id
                }
            }
        }
    
        await dynamoDB.delete(params).promise();
    }

    async tryToUpdateVisitor(body: any): Promise<boolean> {
        const isValidateSchema = validateSchema(body, updateVisitorSchema);

        if (!isValidateSchema) {
            return false;
        }
    
        const visitor: Visitor = body;
        const numberOfKeys = Object.keys(visitor).length;

        if (numberOfKeys == 1) {
            return false;
        }

        const dynamoDBUpdateArgs = generateExpression(visitor);

        const params = {
            TableName: this.visitorTable,
            Key: {
                visitorId: {
                    S: visitor.visitorId
                }
            },
            UpdateExpression: dynamoDBUpdateArgs.updateExpression,
            ExpressionAttributeValues: dynamoDBUpdateArgs.expressionAttributeValues
        }
    
        await dynamoDB.update(params).promise();
    
        return true;
    }
}