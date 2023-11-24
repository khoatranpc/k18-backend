import { Router } from 'express';
import feedbackController from '../controllers/feedback';
import feedbackResponseController from '../controllers/feedbackResponse';
import middlewares from '../middlewares';
import { ROLE } from '../global/enum';

const FeedbackRouter = Router();
FeedbackRouter.get('/list-class', middlewares.verifyJWT, middlewares.isTE, feedbackController.getRecordByMonth);
FeedbackRouter.put('/:feedbackId', middlewares.verifyJWT, middlewares.isTE, feedbackController.updateRecord);
FeedbackRouter.get('/form/class', feedbackController.getClassForStudentFormFeedback);
FeedbackRouter.get('/form/class/:classId/group', feedbackController.getGroupInClass);
FeedbackRouter.post('/response', feedbackResponseController.sendResponseFromForm);
FeedbackRouter.get('/response', middlewares.verifyJWT, middlewares.acceptRole(undefined, ROLE.TE, ROLE.TEACHER), feedbackResponseController.getListRecordResponse);
FeedbackRouter.get('/teacher/response', middlewares.verifyJWT, middlewares.isTE, feedbackResponseController.getListRecordResponseByTeacherId);
export default FeedbackRouter;