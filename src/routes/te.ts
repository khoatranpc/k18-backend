import { Router } from 'express';
import middlewares from '../middlewares';
import teController from '../controllers/te';
import { ROLE } from '../global/enum';

const TERouter = Router();
TERouter.get('', middlewares.verifyJWT, middlewares.acceptRole(undefined, ROLE.TE, ROLE.TEACHER), teController.getBySingleField);
TERouter.get('/:accountId', middlewares.verifyJWT, middlewares.isTE, teController.getByAccountId);
TERouter.post('', middlewares.verifyJWT, middlewares.isTE, teController.createTeInfo);

export default TERouter;