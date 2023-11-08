import { Router } from "express";
import mailTemplateController from "../controllers/mailTemplate";
import middlewares from "../middlewares";
import { validate } from "../utils/validate";
import { createMailTemplateSchema, updateMailTemplateSchema } from "../controllers/mailTemplate/validate";
const MailTemplateRouter = Router();

MailTemplateRouter.get('', middlewares.verifyJWT, middlewares.isTE, mailTemplateController.get);
MailTemplateRouter.post('', middlewares.verifyJWT, middlewares.isTE, validate(createMailTemplateSchema), mailTemplateController.create);
MailTemplateRouter.put('/:id', middlewares.verifyJWT, middlewares.isTE, validate(updateMailTemplateSchema), mailTemplateController.update);
export default MailTemplateRouter;