import { Router } from 'express';
import middlewares from '../middlewares';
import teController from '../controllers/te';

const TERouter = Router();
TERouter.get('', middlewares.verifyJWT, middlewares.isTE, teController.getBySingleField);
TERouter.get('/:accountId', middlewares.verifyJWT, middlewares.isTE, teController.getByAccountId);
TERouter.post('', middlewares.verifyJWT, middlewares.isTE, teController.createTeInfo);

export default TERouter;