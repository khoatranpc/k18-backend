import { Router } from "express";
import studentController from "../controllers/student";
const StudentRouter = Router();

StudentRouter.post('', studentController.saveInfo);
export default StudentRouter;