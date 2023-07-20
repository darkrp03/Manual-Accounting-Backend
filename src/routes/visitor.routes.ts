import { Router } from "express";
import { VisitorController } from "../controllers";
import { IRouter } from "../models";
import { container } from "../container";
import { injectable } from "inversify";

@injectable()
export class VisitorRouter implements IRouter {
    private readonly router: Router;
    private readonly visitorController: VisitorController;

    constructor() {
        this.router = Router();
        this.visitorController = container.resolve(VisitorController);

        this.initializeHTTPMethods();
    }

    getRoute(): Router {
        return this.router;
    }

    initializeHTTPMethods(): void {
        this.router.get('/visitors', this.visitorController.getVisitors.bind(this.visitorController));
        this.router.get('/visitors/:id', this.visitorController.getVisitor.bind(this.visitorController));
        this.router.post('/addVisitor', this.visitorController.addVisitor.bind(this.visitorController));
        this.router.post('/deleteVisitor/:id', this.visitorController.deleteVisitor.bind(this.visitorController));
        this.router.post('/updateVisitor', this.visitorController.updateVisitor.bind(this.visitorController));
    }
}

