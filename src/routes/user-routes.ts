import { Router } from "express";
import { UserController } from "../controllers";
import { checkIsAuthenticated } from "../functions/passport-strategy";
import passport from "passport";

export const userRouters = Router();
const userController = new UserController();

userRouters.get('/user', checkIsAuthenticated, userController.getUser);
userRouters.post('/login', passport.authenticate('local'), userController.login);
userRouters.get('/logout', checkIsAuthenticated, userController.logout);