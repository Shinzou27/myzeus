import { Router } from "express";
import { ReportController } from "./controller/ReportController";
import { UserController } from "./controller/UserController";
import { PetController } from "./controller/PetController";
export const routes = Router();

const reportController = new ReportController();
const userController = new UserController();
const petController = new PetController();

routes.post('/reports', reportController.create);
routes.get('/reports', reportController.list);
routes.put('/reports/:id', reportController.update);
routes.delete('/reports/:id', reportController.delete);
routes.get('/reports/:id', reportController.get);

routes.post('/users', userController.create)
routes.get('/users', userController.log);
routes.get('/admin/users', userController.list);
routes.put('/users/:id', userController.updatePassword);
routes.delete('/users/:id', userController.delete);

routes.post('/pets', petController.create);
routes.get('/pets', petController.list);
routes.put('/pets/:id', petController.update);
routes.delete('/pets/:id', petController.delete);
routes.get('/pets/:id', petController.get);