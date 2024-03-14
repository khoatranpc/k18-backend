import { Router } from 'express';
import middlewares from '../middlewares';
import teController from '../controllers/te';
import { ROLE } from '../global/enum';
import upload from '../utils/multer';

const TERouter = Router();
TERouter.get('', middlewares.verifyJWT, middlewares.acceptRole(undefined, ROLE.TE, ROLE.TEACHER), teController.getBySingleField);
TERouter.get('/:id', middlewares.verifyJWT, middlewares.isTE, teController.getById);
TERouter.put('/:id', middlewares.verifyJWT, middlewares.isTE, middlewares.checkEqualIdForUpdate, upload.single("fileImage"), teController.updateInfo);
TERouter.post('', middlewares.verifyJWT, middlewares.isTE, teController.createTeInfo);
TERouter.post('/new-te', middlewares.verifyJWT, middlewares.isTE, teController.createNewTe);

export default TERouter;