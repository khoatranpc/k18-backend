import { Router } from "express";
import teacherController from "../controllers/teacher";
import middlewares from "../middlewares";
import { PositionTe, ROLE } from "../global/enum";
import upload from "../utils/multer";

const TeacherRouter = Router();
TeacherRouter.get('', middlewares.verifyJWT, middlewares.isTE, teacherController.getAll);
TeacherRouter.get('/find', middlewares.verifyJWT, middlewares.isTE, teacherController.findByEmail);
TeacherRouter.get('/:id', middlewares.verifyJWT, middlewares.isTE, teacherController.getOne);
TeacherRouter.put('/:id', middlewares.verifyJWT, middlewares.acceptRole(PositionTe.LEADER, ROLE.TEACHER), middlewares.checkEqualIdForUpdate, teacherController.findByIdAndUpdate);
TeacherRouter.post('/import', middlewares.verifyJWT, middlewares.isTE, upload.single('csvFile'), teacherController.importCSV);
export default TeacherRouter;