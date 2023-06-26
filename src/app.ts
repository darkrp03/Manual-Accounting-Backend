import { DynamoDB } from 'aws-sdk';
import Express, { NextFunction, Request, Response } from 'express';
import serverless from 'serverless-http';
import bodyParser from 'body-parser';
import { userRouters } from './routes'

const app = Express();
const cors = require('cors');
export const dynamoDB = new DynamoDB();

app.use(bodyParser.json());
app.use(cors());
app.options('*', cors({
    origin: 'localhost:5173',
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(userRouters);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);

    return res.writeHead(500).end(res.statusMessage);
});

const handler = serverless(app);

module.exports.getUsers = async (context: any, req: any) => {
    context.res = await handler(context, req);

    return context.res;
};

module.exports.getUser = async (context: any, req: any) => {
    context.res = await handler(context, req);

    return context.res;
}

module.exports.addUser = async (context: any, req: any) => {
    context.res = await handler(context, req);

    return context.res;
}

module.exports.deleteUser = async (context: any, req: any) => {
    context.res = await handler(context, req);

    return context.res;
}

module.exports.updateUser = async (context: any, req: any) => {
    context.res = await handler(context, req);

    return context.res;
}