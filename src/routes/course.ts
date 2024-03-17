import express from 'express';
import courseController from '../controllers/course';
import { validate } from '../utils/validate';
import { createCourseSchema, updateCourseSchema } from '../controllers/course/validate';
import middlewares from '../middlewares';
import upload from '../utils/multer';

const CourseRouter = express.Router();

CourseRouter.get('', middlewares.verifyJWTnotRequired, courseController.getAll);
CourseRouter.get('/:id', courseController.getById);

CourseRouter.post('', middlewares.verifyJWT, middlewares.isTE, upload.single("fileImage"), validate(createCourseSchema, 403), courseController.createCourse);
CourseRouter.put('/:id', middlewares.verifyJWT, middlewares.isTE, upload.single("fileImage"), validate(updateCourseSchema, 403), courseController.updateCourse);


export default CourseRouter;