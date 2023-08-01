import { injectable } from "inversify";
import { dynamoDB } from "../app";
import { validateSchema } from "../functions";
import { addVisitorSchema, updateVisitorSchema } from "../schemas";
import { getVisitorUpdateExpression } from "../functions";
import { Visitor } from "../models";
import { visitorTable } from "../config";

@injectable()
export class VisitorService {
    async addUser(username: string) {
        const params = {
            TableName: visitorTable,
            Item: {
                username: username,
                visitors: []
            }
        }

        await dynamoDB.put(params).promise();
    }

    async getVisitors(username: string) {
        const params = {
            TableName: visitorTable,
            Key: {
                username: username
            }
        }

        const data = await dynamoDB.get(params).promise();

        return data.Item?.visitors;
    }

    async tryToAddVisitor(username: string, body: any): Promise<boolean> {
        const isValidateSchema = validateSchema(body, addVisitorSchema);

        if (!isValidateSchema) {
            return false;
        }

        const visitor: Visitor = body;
 
        const params = {
            TableName: visitorTable,
            Key: {
                username: username
            },
            UpdateExpression: "SET visitors = list_append(visitors, :newValue)",
            ExpressionAttributeValues: {
                ":newValue": [visitor]
            }
        }
    
        await dynamoDB.update(params).promise();
    
        return true;
    }

    async deleteVisitor(username: string, visitorId: string) {
        const visitors = await this.getVisitors(username);
        const visitorIndex = visitors?.findIndex((visitor: any) => visitor.visitorId == visitorId);

        const params = {
            TableName: visitorTable,
            Key: {
                username: username
            },
            UpdateExpression: `REMOVE visitors[${visitorIndex}]`
        }
    
        await dynamoDB.update(params).promise();
    }

    async tryToUpdateVisitor(username: string, body: any): Promise<boolean> {
        const isValidateSchema = validateSchema(body, updateVisitorSchema);

        if (!isValidateSchema) {
            return false;
        }
    
        const visitor: Visitor = body;
        const numberOfKeys = Object.keys(visitor).length;

        if (numberOfKeys == 1) {
            return false;
        }

        const visitors = await this.getVisitors(username);
        const visitorIndex = visitors?.findIndex((visitor: any) => visitor.visitorId == body["visitorId"]);

        const dynamoDBUpdateArgs = getVisitorUpdateExpression(visitorIndex, visitor);

        const params = {
            TableName: visitorTable,
            Key: {
                username: username
            },
            UpdateExpression: dynamoDBUpdateArgs.updateExpression,
            ExpressionAttributeValues: dynamoDBUpdateArgs.expressionAttributeValues
        }
    
        await dynamoDB.update(params).promise();
    
        return true;
    }
}