import { Request, Response } from "express";
import { dynamoDB } from "../app";
import { addUserSchema, updateUserSchema } from "../schemas";
import Ajv from "ajv";
import { User } from "../models";
import { generateExpression } from "../functions";

const tableName = process.env.USERS_TABLE as string;

export class UserController {
    async getUsers(req: Request, res: Response) {
        const params = {
            TableName: tableName
        }
    
        const data = await dynamoDB.scan(params).promise();
    
        return res.writeHead(200).end(JSON.stringify(data.Items));
    }

    async getUser(req: Request, res: Response) {
        const params = {
            Key: {
                userId: {
                    S: req.params["id"]
                }
            },
            TableName: tableName
        }
    
        const user = await dynamoDB.getItem(params).promise();
    
        return res.writeHead(200).end(JSON.stringify(user.Item));
    }

    async addUser(req: Request, res: Response) {
        const ajv = new Ajv();
        const validate = ajv.compile(addUserSchema);
        const isValidateSchema = validate(req.body);

        console.log(req.body);
    
        if (!isValidateSchema) {
            return res.writeHead(400).end(res.statusMessage);
        }
    
        const newUser = {
            userId: {
                S: req.body["userId"]
            },
            username: {
                S: req.body["username"]
            },
            userSurname: {
                S: req.body["userSurname"]
            },
            entryTime: {
                S: req.body["entryTime"]
            }
        }
    
        const params = {
            TableName: tableName,
            Item: newUser
        }
    
        await dynamoDB.putItem(params).promise();
    
        return res.writeHead(200).end(res.statusMessage);
    }

    async deleteUser(req: Request, res: Response) {
        const params = {
            TableName: tableName,
            Key: {
                userId: {
                    S: req.params["id"]
                }
            }
        }
    
        await dynamoDB.deleteItem(params).promise();
    
        return res.writeHead(200).end(res.statusMessage);
    }

    async updateUser(req: Request, res: Response) {
        const ajv = new Ajv();
        const validate = ajv.compile(updateUserSchema);
        const isValidateSchema = validate(req.body);

        if (!isValidateSchema) {
            return res.writeHead(400).end(res.statusMessage);
        }
    
        const user: User = req.body;
        const numberOfKeys = Object.keys(user).length;

        if (numberOfKeys == 1) {
            return res.writeHead(400).end(res.statusMessage);
        }

        const dynamoDBUpdateArgs = generateExpression(user);

        const params = {
            TableName: tableName,
            Key: {
                userId: {
                    S: user.userId
                }
            },
            UpdateExpression: dynamoDBUpdateArgs.updateExpression,
            ExpressionAttributeValues: dynamoDBUpdateArgs.expressionAttributeValues
        }
    
        await dynamoDB.updateItem(params).promise();
    
        return res.writeHead(200).end(res.statusMessage);
    }
}