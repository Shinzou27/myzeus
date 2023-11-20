import { Router } from "express";
import { ReportController } from "./controller/ReportController";
export const routes = Router();

const reportController = new ReportController();

routes.post('/reports', reportController.create);
routes.get('/reports', reportController.list);
routes.get('/reports/:id', reportController.get);
routes.delete('/reports/:id', reportController.delete);
routes.put('/reports/:id', reportController.update);