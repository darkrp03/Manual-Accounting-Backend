import { Router } from "express";

export interface IRouter {
    getRoute(): Router;
    initializeHTTPMethods(): void;
}