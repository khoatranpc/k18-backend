import { Router } from 'express';
import middlewares from '../middlewares';
import recruitmentController from '../controllers/recruitment';
const RecruitmentRouter = Router();
RecruitmentRouter.get('', middlewares.verifyJWT, middlewares.isTE, recruitmentController.getList);
RecruitmentRouter.get('/candidate/:id', middlewares.verifyJWT, middlewares.isTE, recruitmentController.getOneById);
RecruitmentRouter.post('', middlewares.verifyJWT, middlewares.isTE, recruitmentController.create);
export default RecruitmentRouter;