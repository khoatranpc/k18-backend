import { Router } from "express";
import middlewares from "../middlewares";
import classSessionController from "../controllers/classSession";
import { validate } from "../utils/validate";
import { validateCreateSessionBody } from "../controllers/classSession/validate";

const ClassSessionRouter = Router();
ClassSessionRouter.get('/:classId', middlewares.verifyJWT, classSessionController.getClassSessionByClassId);
ClassSessionRouter.get('/session/:sessionId', middlewares.verifyJWT, middlewares.isTE, classSessionController.getTeacherInSession);
ClassSessionRouter.post('', middlewares.verifyJWT, middlewares.isTE, validate(validateCreateSessionBody), classSessionController.handleClassSession);

export default ClassSessionRouter;