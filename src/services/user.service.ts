import { inject, injectable } from "inversify";
import { dynamoDB } from "../app";
import { validateSchema } from "../functions";
import { userSchema } from "../schemas";
import bcrypt from "bcrypt";
import { User } from "../models";
import { ContainerType, userTable } from "../config";
import { VisitorService } from "./visitor.service";

@injectable()
export class UserService {
    private readonly visitorService: VisitorService;

    constructor(@inject(ContainerType.VisitorService) visitorService: VisitorService) {
        this.visitorService = visitorService;
    }

    private async isRegistered(username: string): Promise<boolean> {
        const params = {
            TableName: userTable,
            Key: {
                username: username
            }
        }

        const data = await dynamoDB.get(params).promise();

        if (data.Item) {
            return true;
        }

        return false;
    }

    async tryToRegister(body: any): Promise<User | undefined> {
        const isValidatedSchema = validateSchema(body, userSchema);
 
        if (!isValidatedSchema) {
            return undefined;
        }

        if (await this.isRegistered(body["username"])) {
            return undefined;
        }

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(body["password"], saltRounds);

        const user: User = {
            username: body.username,
            password: hashPassword
        }

        const params = {
            TableName: userTable,
            Item: user
        };

        this.visitorService.addUser(user.username!);
        await dynamoDB.put(params).promise();
        
        return user;
    }
}