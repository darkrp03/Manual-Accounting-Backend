import passport from "passport";
import { Strategy } from "passport-local";
import { dynamoDB } from "../app";

export function checkIsAuthenticated(req: any, res: any, next: any) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.writeHead(401).end(res.statusMessage);
}

export function initializePassportStrategy() {
    passport.serializeUser((user: any, done) => {
        done(null, user.username.S);
    });
    
    passport.deserializeUser(async (username: any, done) => {
        const params = {
            Key: {
                username: {
                    S: username
                }
            },
            TableName: 'users-table'
        }

        try {
            const data = await dynamoDB.getItem(params).promise();

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
            TableName: 'users-table'
        }

        try {
            const data = await dynamoDB.getItem(params).promise();
    
            if (!data) {
                return done(null, false);
            }
    
            if (!data.Item) {
                return done(null, false);
            }
    
            const user = data.Item;
    
            if (user.password.S !== password) {
                return done(null, false)
            }
    
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));
}

