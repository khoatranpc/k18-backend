import { Router } from "express";
import middlewares from "../middlewares";
import teacherRegisterCourseController from "../controllers/TeacherRegisterCourse";
import { ROLE } from "../global/enum";

const TeacherRegisterCouseRouter = Router();
TeacherRegisterCouseRouter.get('', middlewares.verifyJWT, middlewares.acceptRole(undefined, ROLE.TE, ROLE.TEACHER), teacherRegisterCourseController.getDataByListTeacherId);
export default TeacherRegisterCouseRouter;