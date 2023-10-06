import { Router } from 'express';
import roundController from '../controllers/recruitment/round';
import RoundCommentRouter from './roundComment';
import { validate } from '../utils/validate';
import { createRecordDataRound, updateRecoredDataRound } from '../controllers/recruitment/round/validate';

const RoundProcessRouter = Router();
// round CV
RoundProcessRouter.post('', validate(createRecordDataRound, 403), roundController.create);
RoundProcessRouter.put('/:id', validate(updateRecoredDataRound, 403), roundController.findByIdAndUpdate);
RoundProcessRouter.get('', roundController.getRound);
RoundProcessRouter.use('/comment', RoundCommentRouter);


export default RoundProcessRouter;