import { Router } from "express";
import { medicationsController } from "./controller";

export const medicationsRouter = Router();

medicationsRouter.get('/', medicationsController.list);
medicationsRouter.post('/', medicationsController.create);
