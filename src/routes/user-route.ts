import { Router } from "express";
import { UserController } from "../controllers";

export const userRouters = Router();
const userController = new UserController();

userRouters.get('/users', userController.getUsers);
userRouters.get('/users/:id', userController.getUser);
userRouters.post('/addUser', userController.addUser);
userRouters.post('/deleteUser/:id', userController.deleteUser);
userRouters.post('/updateUser', userController.updateUser);