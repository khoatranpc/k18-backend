import { Router } from 'express';
import preTeacherController from '../controllers/preTeacher';
import { validate } from '../utils/validate';
import { preTeacherSchema } from '../controllers/preTeacher/validate';

const PreTeacherRouter = Router();
PreTeacherRouter.post('', validate(preTeacherSchema), preTeacherController.register);

export default PreTeacherRouter;