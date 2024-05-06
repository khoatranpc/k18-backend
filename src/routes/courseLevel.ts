import express from 'express';
import { validate } from '../utils/validate';
import middlewares from '../middlewares';
import courseLevelController from '../controllers/courseLevel';
import { createCourseLevelSchema } from '../controllers/courseLevel/validate';
import upload from '../utils/multer';

const CourseLevelRouter = express.Router();

CourseLevelRouter.get('/:courseId', middlewares.verifyJWTnotRequired, courseLevelController.getByCourseId);
CourseLevelRouter.post('', middlewares.verifyJWT, middlewares.isTE, validate(createCourseLevelSchema, 403), courseLevelController.create);
CourseLevelRouter.put('/:id', middlewares.verifyJWT, middlewares.isTE, upload.single("fileImage"), courseLevelController.updateCourseLevel);


export default CourseLevelRouter;