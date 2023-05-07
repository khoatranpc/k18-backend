import { Router } from 'express';
import bookTeacherController from '../controllers/bookTeacher';
import middlewares from '../middlewares';
import { validate } from '../utils/validate';
import { bookTeacherSchema } from '../controllers/bookTeacher/validate';

const BookTeacherRouter = Router();
BookTeacherRouter.get('/:classId', bookTeacherController.getByClassId)
BookTeacherRouter.post('', middlewares.verifyJWT, middlewares.isTE, validate(bookTeacherSchema), bookTeacherController.create)
BookTeacherRouter.put('/:idRequest', middlewares.verifyJWT, bookTeacherController.handleTeacherRegisterLocaltionForClass)
export default BookTeacherRouter;