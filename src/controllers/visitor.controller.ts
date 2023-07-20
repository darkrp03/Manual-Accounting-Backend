import { Request, Response } from "express";
import { VisitorService } from "../services";
import { inject, injectable } from "inversify";
import { ContainerType, redisHost, redisPassword, redisPort, secretKey } from "../config";

@injectable()
export class VisitorController {
    private readonly visitorService: VisitorService;

    constructor(@inject(ContainerType.VisitorService) visitorService: VisitorService) {
        this.visitorService = visitorService;
    }

    async getVisitors(req: Request, res: Response) {
        const items = await this.visitorService.getVisitors();

        res.send(items);
    }

    async getVisitor(req: Request, res: Response) {
        const item = await this.visitorService.getVisitor(req.params.id);

        res.send(item);
    }

    async addVisitor(req: Request, res: Response) {
        const isVisitorAdded = await this.visitorService.tryToAddVisitor(req.body);

        if (!isVisitorAdded) {
            return res.sendStatus(400);
        }

        res.sendStatus(200);
    }

    async deleteVisitor(req: Request, res: Response) {
        this.visitorService.deleteVisitor(req.params.id);

        res.sendStatus(200);
    }

    async updateVisitor(req: Request, res: Response) {
        const isVisitorUpdated = this.visitorService.tryToUpdateVisitor(req.body);

        if (!isVisitorUpdated) {
            return res.sendStatus(400);
        }

        res.sendStatus(200);
    }
}