import { Router } from "express";
import { VisitorController } from "../controllers";

export const visitorRouters = Router();
const visitorController = new VisitorController();

visitorRouters.get('/visitors', visitorController.getVisitors);
visitorRouters.get('/visitors/:id', visitorController.getVisitor);
visitorRouters.post('/addVisitor', visitorController.addVisitor);
visitorRouters.post('/deleteVisitor/:id', visitorController.deleteVisitor);
visitorRouters.post('/updateVisitor', visitorController.updateVisitor);