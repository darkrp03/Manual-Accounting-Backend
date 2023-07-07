import { Request, Response } from "express";

export class UserController {
    getUser(req: Request, res: Response) {
        res.writeHead(200).end(res.statusMessage);
    }

    login(req: Request, res: Response) {
        res.writeHead(200).end(res.statusMessage);
    }

    logout(req: Request, res: Response) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);

                res.writeHead(500).end(res.statusMessage);
            }

            res.writeHead(200).end(res.statusMessage);
        });
    }
}