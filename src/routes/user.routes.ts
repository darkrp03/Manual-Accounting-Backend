import { Router } from "express";
import { UserController } from "../controllers";
import { checkIsAuthenticated } from "../functions";
import passport from "passport";
import { IRouter } from "../models";
import { container } from "../container";
import { injectable } from "inversify";

@injectable()
export class UserRouter implements IRouter {
    private readonly router: Router;
    private readonly userController: UserController;

    constructor() {
        this.router = Router();
        this.userController = container.resolve(UserController);

        this.initializeHTTPMethods();
    }

    getRoute(): Router {
        return this.router;
    }

    initializeHTTPMethods(): void {
        this.router.get('/user', checkIsAuthenticated, this.userController.getUser.bind(this.userController));
        this.router.post('/login', passport.authenticate('local'), this.userController.login.bind(this.userController));
        this.router.get('/logout', checkIsAuthenticated, this.userController.logout.bind(this.userController));
        this.router.post('/register', this.userController.register.bind(this.userController));
    }
}