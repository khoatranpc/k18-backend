import express from 'express';
import middlewares from '../middlewares';
import timeScheduleController from '../controllers/timeSchedule';
import { validate } from '../utils/validate';
import { createTimeScheduleSchema } from '../controllers/timeSchedule/validate';

const TimeScheduleRouter = express.Router();

TimeScheduleRouter.get('', timeScheduleController.getAll);
TimeScheduleRouter.post('', middlewares.verifyJWT, middlewares.isTE, validate(createTimeScheduleSchema), timeScheduleController.create);
TimeScheduleRouter.put('/:id', middlewares.verifyJWT, middlewares.isTE, timeScheduleController.update);


export default TimeScheduleRouter;