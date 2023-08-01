import { Container } from "inversify";
import { UserController, VisitorController } from "./controllers";
import { VisitorService, UserService } from "./services";
import { ContainerType } from "./config";
import { UserRouter, VisitorRouter } from "./routes";

export const container = new Container();

container.bind(ContainerType.IRouter).to(UserRouter);
container.bind(ContainerType.IRouter).to(VisitorRouter);
container.bind(ContainerType.UserController).to(UserController).inSingletonScope();
container.bind(ContainerType.UserService).to(UserService).inSingletonScope();
container.bind(ContainerType.VisitorController).to(VisitorController).inSingletonScope();
container.bind(ContainerType.VisitorService).to(VisitorService).inSingletonScope();