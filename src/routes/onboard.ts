import { Router } from "express";
import recruitmentController from "../controllers/recruitment";
import { validate } from "../utils/validate";
import { feedbackClautid, registerClautidSchema } from "../controllers/recruitment/validate";

const OnboardRouter = Router();
OnboardRouter.get('', recruitmentController.getCandidateByEmailForOnboard);
OnboardRouter.get('/clautid', recruitmentController.getRoundClautid);
OnboardRouter.post('/clautid', validate(registerClautidSchema, 403), recruitmentController.registerClautid);

OnboardRouter.post('/clautid/feedback', validate(feedbackClautid, 403), recruitmentController.createFeedbackClautid);
OnboardRouter.get('/clautid/feedback', recruitmentController.getFeedbackClautid);

OnboardRouter.put('/clautid/:recordId', recruitmentController.updateClautid);

OnboardRouter.get('/clautid/test', recruitmentController.getRoundTest);
export default OnboardRouter;