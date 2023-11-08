import { Router } from "express";
import recruitmentController from "../controllers/recruitment";
const OnboardRouter = Router();
OnboardRouter.get('', recruitmentController.getCandidateByEmailForOnboard);
OnboardRouter.get('/clautid', recruitmentController.getRoundClautid);
export default OnboardRouter;