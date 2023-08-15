import { Router } from "express";
import classTeacherPointController from "../controllers/classTeacherPoint";
import middlewares from "../middlewares";
const ClassTeacherPointRouter = Router();

ClassTeacherPointRouter.get('', middlewares.verifyJWT, middlewares.isTE, classTeacherPointController.getClassTeacherPointByListClassId);
export default ClassTeacherPointRouter;