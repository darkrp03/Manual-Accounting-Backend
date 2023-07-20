import serverless from 'serverless-http';
import { app } from './app';

const handler = serverless(app);
const serverlessCallback = async (context: any, req: any) => {
    context.res = await handler(context, req);

    return context.res;
};

export const getVisitors = serverlessCallback;
export const getVisitor = serverlessCallback;
export const addVisitor = serverlessCallback;
export const deleteVisitor = serverlessCallback;
export const updateVisitor = serverlessCallback;
export const login = serverlessCallback;
export const user = serverlessCallback;
export const logout = serverlessCallback;
export const register = serverlessCallback;