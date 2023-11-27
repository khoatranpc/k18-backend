import { Router } from 'express';
import middlewares from '../middlewares';
import recruitmentController from '../controllers/recruitment';
import RoundProcessRouter from './roundProcessRecruitment';
import OnboardRouter from './onboard';

const RecruitmentRouter = Router();
RecruitmentRouter.get('', middlewares.verifyJWT, middlewares.isTE, recruitmentController.getList);
RecruitmentRouter.get('/candidate/:id', middlewares.verifyJWT, middlewares.isTE, recruitmentController.getOneById);
RecruitmentRouter.put('/candidate/:id', middlewares.verifyJWT, middlewares.isTE, recruitmentController.updateOnCandidateById);
RecruitmentRouter.post('', middlewares.verifyJWT, middlewares.isTE, recruitmentController.create);
RecruitmentRouter.use('/round', middlewares.verifyJWT, middlewares.isTE, RoundProcessRouter);
RecruitmentRouter.use('/on-board', OnboardRouter);
export default RecruitmentRouter;