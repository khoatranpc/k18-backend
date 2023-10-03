import { Router } from 'express';
// import middlewares from '../middlewares';
import roundCVController from '../controllers/recruitment/round/cv';
import RoundCommentRouter from './roundComment';

const RoundProcessRouter = Router();
// round CV
// RoundProcessRouter.post('', middlewares.isTE, roundCVController.create);
RoundProcessRouter.get('', roundCVController.getRound);
RoundProcessRouter.use('/comment', RoundCommentRouter);


export default RoundProcessRouter;