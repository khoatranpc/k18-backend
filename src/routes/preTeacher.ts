import { Router } from 'express';
import preTeacherController from '../controllers/preTeacher';
import { validate } from '../utils/validate';
import { preTeacherSchema } from '../controllers/preTeacher/validate';
import middlewares from '../middlewares';

const PreTeacherRouter = Router();
PreTeacherRouter.get('', middlewares.verifyJWT, middlewares.isTE, preTeacherController.getAll);
PreTeacherRouter.post('', validate(preTeacherSchema), preTeacherController.register);
PreTeacherRouter.put('/:id', middlewares.verifyJWT, middlewares.isTE, preTeacherController.acceptRequestRegister);

export default PreTeacherRouter;