import express from 'express';
import AccountRouter from './account';
import CourseRouter from './course';
import CourseLevelRouter from './courseLevel';
import TimeScheduleRouter from './timeSchedule';
import ClassRouter from './class';
import LocationRouter from './location';
import BookTeacherRouter from './bookTeacher';
import PreTeacherRouter from './preTeacher';
import TeacherRouter from './teacher';

const RootRouter = express.Router();

RootRouter.use('/account', AccountRouter);
RootRouter.use('/auth', AccountRouter);
RootRouter.use('/course', CourseRouter);
RootRouter.use('/course/level', CourseLevelRouter);
RootRouter.use('/time-schedule', TimeScheduleRouter);
RootRouter.use('/class', ClassRouter);
RootRouter.use('/location', LocationRouter);
RootRouter.use('/book-teacher', BookTeacherRouter);
RootRouter.use('/pre-teacher', PreTeacherRouter);
RootRouter.use('/teacher', TeacherRouter);

export default RootRouter;