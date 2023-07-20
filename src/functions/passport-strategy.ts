import passport from "passport";
import { Strategy } from "passport-local";
import { dynamoDB } from "../app";
import bcrypt from 'bcrypt';
import { User } from "../models";
import { userTable } from "../config";

export function checkIsAuthenticated(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.sendStatus(401);
}

export function initializePassportStrategy() {
    passport.serializeUser((user: User, done) => {
        done(null, user.username);
    });
    
    passport.deserializeUser(async (username: string, done) => {
        const params = {
            Key: {
                username: {
                    S: username
                }
            },
            TableName: userTable
        }

        try {
            const data = await dynamoDB.get(params).promise();

            if (!data.Item) {
                return done(new Error('User not found.'));
            }

            const user = data.Item;

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    });

    passport.use(new Strategy(async (username, password, done) => {
        const params = {
            Key: {
                username: {
                    S: username
                }
            },
            TableName: userTable
        }

        try {
            const data = await dynamoDB.get(params).promise();
    
            if (!data) {
                return done(null, false);
            }
    
            if (!data.Item) {
                return done(null, false);
            }
    
            const dynamoDBUser = data.Item;
            const isCorrectPassword = await bcrypt.compare(password, dynamoDBUser.password.S!);
    
            if (!isCorrectPassword) {
                return done(null, false)
            }

            const user: User = {
                username: dynamoDBUser.username.S,
                password: dynamoDBUser.password.S
            };

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));
}

