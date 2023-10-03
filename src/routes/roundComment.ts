import { Router } from 'express';
// import middlewares from '../middlewares';
import roundCommentController from '../controllers/recruitment/round/comment';

const RoundCommentRouter = Router();
// round CV
// RoundProcessRouter.post('', middlewares.isTE, roundCVController.create);
RoundCommentRouter.get('', roundCommentController.getComment);
RoundCommentRouter.post('', roundCommentController.createComment);




export default RoundCommentRouter;