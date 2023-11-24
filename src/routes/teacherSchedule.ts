import { Router } from "express";
import middlewares from "../middlewares";
import teacherScheduleController from "../controllers/teacherSchedule";
import { ROLE } from "../global/enum";

const TeacherScheduleRouter = Router();

TeacherScheduleRouter.get('/:teacherId', middlewares.verifyJWT, middlewares.acceptRole(undefined, ROLE.TE, ROLE.TEACHER), teacherScheduleController.getOneByidTeacher);
export default TeacherScheduleRouter;