import { Request, Response } from "express";
import { dynamoDB } from "../app";
import { addVisitorSchema, updateVisitorSchema } from "../schemas";
import Ajv from "ajv";
import { Visitor } from "../models";
import { generateExpression } from "../functions";

const tableName = process.env.VISITORS_TABLE as string;

export class VisitorController {
    async getVisitors(req: Request, res: Response) {
        const params = {
            TableName: tableName
        }
    
        const data = await dynamoDB.scan(params).promise();
    
        return res.writeHead(200).end(JSON.stringify(data.Items));
    }

    async getVisitor(req: Request, res: Response) {
        const params = {
            Key: {
                visitorId: {
                    S: req.params["id"]
                }
            },
            TableName: tableName
        }
    
        const visitor = await dynamoDB.getItem(params).promise();
    
        return res.writeHead(200).end(JSON.stringify(visitor.Item));
    }

    async addVisitor(req: Request, res: Response) {
        const ajv = new Ajv();
        const validate = ajv.compile(addVisitorSchema);
        const isValidateSchema = validate(req.body);

        console.log(req.body);
    
        if (!isValidateSchema) {
            return res.writeHead(400).end(res.statusMessage);
        }
    
        const newVisitor = {
            visitorId: {
                S: req.body["visitorId"]
            },
            visitorName: {
                S: req.body["visitorName"]
            },
            visitorSurname: {
                S: req.body["visitorSurname"]
            },
            visitorEntryTime: {
                S: req.body["visitorEntryTime"]
            }
        }
    
        const params = {
            TableName: tableName,
            Item: newVisitor
        }
    
        await dynamoDB.putItem(params).promise();
    
        return res.writeHead(200).end(res.statusMessage);
    }

    async deleteVisitor(req: Request, res: Response) {
        const params = {
            TableName: tableName,
            Key: {
                visitorId: {
                    S: req.params["id"]
                }
            }
        }
    
        await dynamoDB.deleteItem(params).promise();
    
        return res.writeHead(200).end(res.statusMessage);
    }

    async updateVisitor(req: Request, res: Response) {
        const ajv = new Ajv();
        const validate = ajv.compile(updateVisitorSchema);
        const isValidateSchema = validate(req.body);

        console.log(req.body);

        if (!isValidateSchema) {
            return res.writeHead(400).end(res.statusMessage);
        }
    
        const visitor: Visitor = req.body;
        const numberOfKeys = Object.keys(visitor).length;

        if (numberOfKeys == 1) {
            return res.writeHead(400).end(res.statusMessage);
        }

        const dynamoDBUpdateArgs = generateExpression(visitor);

        const params = {
            TableName: tableName,
            Key: {
                visitorId: {
                    S: visitor.visitorId
                }
            },
            UpdateExpression: dynamoDBUpdateArgs.updateExpression,
            ExpressionAttributeValues: dynamoDBUpdateArgs.expressionAttributeValues
        }
    
        await dynamoDB.updateItem(params).promise();
    
        return res.writeHead(200).end(res.statusMessage);
    }
}