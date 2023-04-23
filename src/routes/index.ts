import express from 'express';
import AccountRouter from './account';
import CourseRouter from './course';
import CourseLevelRouter from './courseLevel';
import TimeScheduleRouter from './timeSchedule';

const RootRouter = express.Router();

RootRouter.use('/account', AccountRouter);
RootRouter.use('/course', CourseRouter);
RootRouter.use('/course/level', CourseLevelRouter);
RootRouter.use('/time-schedule', TimeScheduleRouter);

export default RootRouter;