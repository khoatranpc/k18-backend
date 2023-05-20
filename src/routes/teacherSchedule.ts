import { Router } from "express";
import middlewares from "../middlewares";
import teacherScheduleController from "../controllers/teacherSchedule";

const TeacherScheduleRouter = Router();

TeacherScheduleRouter.get('/:teacherId', middlewares.verifyJWT, middlewares.isTE, teacherScheduleController.getOneByidTeacher);
export default TeacherScheduleRouter;