import { Router } from 'express';
import preTeacherController from '../controllers/preTeacher';
import { validate } from '../utils/validate';
import { preTeacherSchema } from '../controllers/preTeacher/validate';
import middlewares from '../middlewares';
import upload from '../utils/multer';

const PreTeacherRouter = Router();
PreTeacherRouter.get('', middlewares.verifyJWT, middlewares.isTE, preTeacherController.getAll);
PreTeacherRouter.post('', upload.fields([{ name: "frontId", maxCount: 1 }, { name: "backId", maxCount: 1 }]), validate(preTeacherSchema), preTeacherController.register);
PreTeacherRouter.put('/:id', middlewares.verifyJWT, middlewares.isTE, preTeacherController.acceptRequestRegister);
PreTeacherRouter.post('/createNewTeacher',preTeacherController.createNewTeacherRequest )

export default PreTeacherRouter;