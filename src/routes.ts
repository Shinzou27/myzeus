import { Router } from "express";
import { ReportController } from "./controller/ReportController";
import { UserController } from "./controller/UserController";
export const routes = Router();

const reportController = new ReportController();
const userController = new UserController();

routes.post('/reports', reportController.create);
routes.get('/reports', reportController.list);
routes.get('/reports/:id', reportController.get);
routes.delete('/reports/:id', reportController.delete);
routes.put('/reports/:id', reportController.update);

routes.post('/users', userController.create)
routes.get('/users', userController.log);
routes.put('/users/:id', userController.updatePassword)