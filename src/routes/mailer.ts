import { Router } from "express";
import mailerController from "../controllers/mailer";
const MailerRouter = Router();

MailerRouter.post('', mailerController.sendMail);
export default MailerRouter;