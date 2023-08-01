import "reflect-metadata";
import AWS from 'aws-sdk';
import Express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import { initializePassportStrategy } from './functions';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import { IRouter } from './models';
import { ContainerType, awsAccessKey, awsSecretAccessKey, port, redisHost, redisPassword, redisPort, secretKey } from "./config";
import { container } from "./container";

AWS.config.update({ 
    accessKeyId:  awsAccessKey, 
    secretAccessKey: awsSecretAccessKey,
    region: 'us-east-1'
});

export const app = Express();
export const dynamoDB = new AWS.DynamoDB.DocumentClient();

const redis = new Redis({
    host: redisHost,
    port: Number(redisPort),
    username: 'default',
    password: redisPassword
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    store: new RedisStore({ client: redis }),
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 60 * 60 * 1000
    }
}));

initializePassportStrategy();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', '*');

    next();
});

const routers: IRouter[] = container.getAll<IRouter>(ContainerType.IRouter);
routers.forEach(router => app.use(router.getRoute()));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);

    return res.sendStatus(500);
});

app.listen(port, () => {
    console.log(`The backend part was successfully launched on http://localhost:${port}`);
});