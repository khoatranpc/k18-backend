import { Router } from 'express';
import bookTeacherController from '../controllers/bookTeacher';
import middlewares from '../middlewares';
import { validate } from '../utils/validate';
import { bookTeacherSchema } from '../controllers/bookTeacher/validate';
import { ROLE } from '../global/enum';

const BookTeacherRouter = Router();
BookTeacherRouter.get('', middlewares.verifyJWT, middlewares.acceptRole(undefined, ...(Object.keys(ROLE) as ROLE[])), bookTeacherController.getListRecordBookTeacher);
BookTeacherRouter.get('/:classId', bookTeacherController.getByClassId);
BookTeacherRouter.post('', middlewares.verifyJWT, middlewares.isTE, validate(bookTeacherSchema), bookTeacherController.create);
BookTeacherRouter.put('/:idRequest', middlewares.verifyJWT, bookTeacherController.handleTeacherRegisterLocaltionForClass);
BookTeacherRouter.get('/teacher/:teacherId', middlewares.verifyJWT, middlewares.isTE, bookTeacherController.getByTeacherRegister);
export default BookTeacherRouter;