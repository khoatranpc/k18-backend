import express from 'express';
import courseController from '../controllers/course';
import { validate } from '../utils/validate';
import { createCourseSchema, updateCourseSchema } from '../controllers/course/validate';
import middlewares from '../middlewares';

const CourseRouter = express.Router();

CourseRouter.get('', courseController.getAll);
CourseRouter.get('/:id', courseController.getById);

CourseRouter.post('', middlewares.verifyJWT, middlewares.isTE, validate(createCourseSchema, 403), courseController.createCourse);
CourseRouter.put('/:id', middlewares.verifyJWT, middlewares.isTE, validate(updateCourseSchema, 403), courseController.updateCourse);


export default CourseRouter;