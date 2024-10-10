import { Router } from "express";
import subjectController from "../controllers/subject";
import middlewares from "../middlewares";

const SubjectRouter = Router();
SubjectRouter.get('', subjectController.getListSubject);
SubjectRouter.post('', middlewares.verifyJWT, middlewares.isTE, subjectController.createSubject);
export default SubjectRouter;