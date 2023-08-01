import { Request, Response } from "express";
import { VisitorService } from "../services";
import { inject, injectable } from "inversify";
import { ContainerType } from "../config";

@injectable()
export class VisitorController {
    private readonly visitorService: VisitorService;

    constructor(@inject(ContainerType.VisitorService) visitorService: VisitorService) {
        this.visitorService = visitorService;
    }

    async getVisitors(req: Request, res: Response) {
        const user = req.user as { username: string };
        const visitors = await this.visitorService.getVisitors(user.username);

        res.send(visitors);
    }

    async addVisitor(req: Request, res: Response) {
        const user = req.user as { username: string };
        const isVisitorAdded = await this.visitorService.tryToAddVisitor(user.username, req.body);

        if (!isVisitorAdded) {
            return res.sendStatus(400);
        }

        res.sendStatus(200);
    }

    async deleteVisitor(req: Request, res: Response) {
        if (!req.body["visitorId"]) {
            return res.sendStatus(400);
        }

        const user = req.user as { username: string };
        this.visitorService.deleteVisitor(user.username, req.body["visitorId"]);

        res.sendStatus(200);
    }

    async updateVisitor(req: Request, res: Response) {
        const user = req.user as { username: string };
        const isVisitorUpdated = this.visitorService.tryToUpdateVisitor(user.username, req.body);

        if (!isVisitorUpdated) {
            return res.sendStatus(400);
        }

        res.sendStatus(200);
    }
}