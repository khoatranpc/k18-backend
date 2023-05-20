import { Router } from "express";
import middlewares from "../middlewares";
import classSessionController from "../controllers/classSession";

const ClassSessionRouter = Router();
ClassSessionRouter.get('/:classId', middlewares.verifyJWT, classSessionController.getClassSessionByClassId);

export default ClassSessionRouter;