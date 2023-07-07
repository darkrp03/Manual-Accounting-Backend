import { DynamoDB } from 'aws-sdk';
import Express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { visitorRouters } from './routes'
import fs from 'fs';
import passport from 'passport';
import session from 'express-session';
import { initializePassportStrategy } from './functions/passport-strategy';
import { userRouters } from './routes/user-routes';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';

const gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(fs);

export const app = Express();
export const dynamoDB = new DynamoDB();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: 'default',
    password: process.env.REDIS_PASSWORD
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    store: new RedisStore({client: redis}),
    secret: process.env.SECRET_KEY as string,
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
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    next();
});

app.use(visitorRouters);
app.use(userRouters);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);

    return res.writeHead(500).end(res.statusMessage);
});