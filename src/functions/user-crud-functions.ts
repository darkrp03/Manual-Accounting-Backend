import { Request, Response } from "express";
import { dynamoDB } from "../app";
import { addUserSchema, updateUserSchema } from "../schemas";
import { v4 as uuidv4 } from 'uuid';
import Ajv from "ajv";
import { User } from "../models";

const tableName = process.env.USERS_TABLE as string;

export async function getUsers(req: Request, res: Response) {
    const params = {
        TableName: tableName
    }

    const data = await dynamoDB.scan(params).promise();

    return res.writeHead(200).end(JSON.stringify(data.Items));
}

export async function getUser(req: Request, res: Response) {
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

export async function addUser(req: Request, res: Response) {
    const ajv = new Ajv();
    const validate = ajv.compile(addUserSchema);
    const isValidateSchema = validate(req.body);

    if (!isValidateSchema) {
        return res.writeHead(400).end(res.statusMessage);
    }

    const uuID = uuidv4();
    const newUser = {
        userId: uuID,
        ...req.body
    }

    const params = {
        TableName: tableName,
        Item: {
            userId: {
                S: newUser.userId
            },
            name: {
                S: newUser.name
            },
            surname: {
                S: newUser.surname
            },
            entryTime: {
                S: newUser.entryTime
            }
        }
    }

    await dynamoDB.putItem(params).promise();

    return res.writeHead(200).end(res.statusMessage);
}

export async function deleteUser(req: Request, res: Response) {
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

export async function updateUser(req: Request, res: Response) {
    const ajv = new Ajv();
    const validate = ajv.compile(updateUserSchema);
    const isValidateSchema = validate(req.body);

    if (!isValidateSchema) {
        return res.writeHead(400).end(res.statusMessage);
    }

    const user: User = req.body;
    console.log(user);

    let updateExpression: string[] = ["SET "];
    let expressionAttributeValues: any;

    if (user.name) {
        updateExpression.push("name = :value1");
        expressionAttributeValues[":value1"] = user.name;
    }

    if (user.surname) {
        updateExpression.push("surname = :value2");
        expressionAttributeValues[":value2"] = user.surname;
    }

    if (user.entryTime) {
        updateExpression.push("surname = :value3");
        expressionAttributeValues[":value3"] = user.entryTime;
    }

    

    const params = {
        TableName: tableName,
        Key: {
            userId: {
                S: req.body["userId"]
            }
        },
        UpdateExpression: updateExpression.toString(),
        ExpressionAttributeValues: expressionAttributeValues
    }

    await dynamoDB.updateItem(params).promise();

    return res.writeHead(200).end(res.statusMessage);
}