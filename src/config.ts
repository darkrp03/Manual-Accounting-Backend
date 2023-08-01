import dotenv from "dotenv";

export const ContainerType = {
    UserController: Symbol.for("UserController"),
    UserService: Symbol.for("UserService"),
    UserRouter: Symbol.for("UserRouter"),
    VisitorController: Symbol.for("VisitorController"),
    VisitorService: Symbol.for("VisitorService"),
    VisitorRouter: Symbol.for("VisitorRouter"),
    IRouter: Symbol.for("IRouter")
};

dotenv.config();

export const userTable = process.env.USERS_TABLE as string;
export const visitorTable = process.env.VISITORS_TABLE as string;
export const redisHost = process.env.REDIS_HOST as string;
export const redisPort = process.env.REDIS_PORT;
export const redisPassword = process.env.REDIS_PASSWORD as string;
export const secretKey = process.env.SECRET_KEY as string;
export const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;
export const awsAccessKey = process.env.AWS_ACCESS_KEY_ID as string;
export const port = process.env.PORT;