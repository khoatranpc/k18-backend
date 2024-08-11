import { Router } from "express";
import mailerController from "../controllers/mailer";
import middlewares from "../middlewares";
const MailerRouter = Router();

MailerRouter.post('', mailerController.sendMail);
MailerRouter.post('/candidate', middlewares.verifyJWT, middlewares.isTE, mailerController.sendMailCandidate);
export default MailerRouter;