import express from 'express';
import middlewares from '../middlewares';
import { validate } from '../utils/validate';
import accountController from '../controllers/account';
import { createAccount, loginSchemaValidate } from '../controllers/account/validate';

const AccountRouter = express.Router();

AccountRouter.post('', validate(loginSchemaValidate, 403), accountController.login);
AccountRouter.post('/create/test', validate(createAccount, 403), accountController.createForTest);
AccountRouter.get('', middlewares.verifyJWT, middlewares.isTE, accountController.getAllAccount);

AccountRouter.get('/personal-info', middlewares.verifyJWT, accountController.getInfo);

export default AccountRouter;