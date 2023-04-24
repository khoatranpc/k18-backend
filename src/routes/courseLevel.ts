import express from 'express';
import { validate } from '../utils/validate';
import middlewares from '../middlewares';
import courseLevelController from '../controllers/courseLevel';
import { createCourseLevelSchema } from '../controllers/courseLevel/validate';

const CourseLevelRouter = express.Router();

CourseLevelRouter.get('/:courseId', courseLevelController.getByCourseId);
CourseLevelRouter.post('', middlewares.verifyJWT, middlewares.isTE, validate(createCourseLevelSchema, 403), courseLevelController.create);
CourseLevelRouter.put('/:id', middlewares.verifyJWT, middlewares.isTE, courseLevelController.updateCourseLevel);


export default CourseLevelRouter;