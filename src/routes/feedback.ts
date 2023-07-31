import { Router } from 'express';
import feedbackController from '../controllers/feedback';
import middlewares from '../middlewares';

const FeedbackRouter = Router();
FeedbackRouter.get('/list-class', middlewares.verifyJWT, middlewares.isTE, feedbackController.getRecordByMonth);
FeedbackRouter.put('/:feedbackId', middlewares.verifyJWT, middlewares.isTE, feedbackController.updateRecord);
export default FeedbackRouter;