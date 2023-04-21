import express from 'express';
import AccountRouter from './account';

const RootRouter = express.Router();

RootRouter.use('/account', AccountRouter);

export default RootRouter;