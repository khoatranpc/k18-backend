import { Router } from "express";
import teacherController from "../controllers/teacher";
import middlewares from "../middlewares";

const TeacherRouter = Router();
TeacherRouter.get('', teacherController.getAll);
TeacherRouter.get('/:id', teacherController.getOne);
TeacherRouter.put('/:id', middlewares.verifyJWT, teacherController.findByIdAndUpdate);
export default TeacherRouter;