import { Router } from "express";
import classTeacherPointController from "../controllers/classTeacherPoint";
import middlewares from "../middlewares";
import { ROLE } from "../global/enum";
const ClassTeacherPointRouter = Router();

ClassTeacherPointRouter.get('', middlewares.verifyJWT, middlewares.acceptRole(undefined, ROLE.TE, ROLE.TEACHER), classTeacherPointController.getClassTeacherPointByListClassId);
export default ClassTeacherPointRouter;