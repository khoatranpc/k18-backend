import { Router } from "express";
import teacherController from "../controllers/teacher";
import middlewares from "../middlewares";

const TeacherRouter = Router();
TeacherRouter.get('', middlewares.verifyJWT, middlewares.isTE, teacherController.getAll);
TeacherRouter.get('/find', middlewares.verifyJWT, middlewares.isTE, teacherController.findByEmail);
TeacherRouter.get('/:id', middlewares.verifyJWT, middlewares.isTE, teacherController.getOne);
TeacherRouter.put('/:id', middlewares.verifyJWT, middlewares.isTE, teacherController.findByIdAndUpdate);
export default TeacherRouter;