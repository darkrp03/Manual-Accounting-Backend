import { Request, Response } from "express";
import { UserService } from "../services";
import { inject, injectable } from "inversify";
import { ContainerType } from "../config";

@injectable()
export class UserController {
    private readonly userService: UserService;

    constructor(@inject(ContainerType.UserService) userService: UserService) {
        this.userService = userService;        
    }

    getUser(req: Request, res: Response) {
        res.sendStatus(200);
    }

    async register(req: Request, res: Response) {
        const user = await this.userService.tryToRegister(req.body);

        if (!user) {
            return res.sendStatus(400);
        }

        req.login(user, (err) => {
            if (err) {
                throw err;
            }

            res.sendStatus(200);
        });
    }

    login(req: Request, res: Response) {
        res.sendStatus(200);
    }

    logout(req: Request, res: Response) {
        req.session.destroy((err) => {
            if (err) {
                throw err;
            }

            res.sendStatus(200);
        });
    }
}