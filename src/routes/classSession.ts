import { Router } from "express";
import middlewares from "../middlewares";
import classSessionController from "../controllers/classSession";
import { validate } from "../utils/validate";
import { getAttendanceTeacher, validateCreateSessionBody, validateaOnLeave } from "../controllers/classSession/validate";

const ClassSessionRouter = Router();

ClassSessionRouter.get('/attendance-teacher', middlewares.verifyJWT, middlewares.isTE, validate(getAttendanceTeacher), classSessionController.getAttendanceTeacher);
ClassSessionRouter.post('/attendance-teacher/generate', middlewares.verifyJWT, middlewares.isTE, classSessionController.generateListRecordTeacherSchedule);

ClassSessionRouter.get('/detail/:classId', middlewares.verifyJWT, classSessionController.getClassSessionByClassId);
ClassSessionRouter.get('/session/:sessionId', middlewares.verifyJWT, middlewares.isTE, classSessionController.getTeacherInSession);
ClassSessionRouter.post('', middlewares.verifyJWT, middlewares.isTE, validate(validateCreateSessionBody), classSessionController.handleClassSession);
ClassSessionRouter.put('/on-leave', middlewares.verifyJWT, middlewares.isTE, validate(validateaOnLeave), classSessionController.handleTeacherOnLeave);

export default ClassSessionRouter;