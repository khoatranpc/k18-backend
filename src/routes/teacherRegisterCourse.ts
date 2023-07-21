import { Router } from "express";
import middlewares from "../middlewares";
import teacherRegisterCourseController from "../controllers/TeacherRegisterCourse";

const TeacherRegisterCouseRouter = Router();
TeacherRegisterCouseRouter.get('', middlewares.verifyJWT, middlewares.isTE, teacherRegisterCourseController.getDataByListTeacherId);
export default TeacherRegisterCouseRouter;