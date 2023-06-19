import { Router } from "express";
import { getUser, getUsers, addUser, deleteUser  } from '../functions'
import { updateUser } from "../functions/user-crud-functions";

export const userRouters = Router();

userRouters.get('/users', getUsers);
userRouters.get('/users/:id', getUser);
userRouters.post('/addUser', addUser);
userRouters.post('/deleteUser/:id', deleteUser);
userRouters.post('/updateUser', updateUser);