import { Router } from "express";
import classController from "../controllers/class";
import middlewares from "../middlewares";
import { validate } from "../utils/validate";
import { createClassSchema } from "../controllers/class/validate";

const ClassRouter = Router();

ClassRouter.get('', middlewares.verifyJWTnotRequired, classController.getAll);
ClassRouter.get('/:id', middlewares.verifyJWT, classController.findOneById);
ClassRouter.post('', middlewares.verifyJWT, middlewares.isTE, validate(createClassSchema), classController.create);
ClassRouter.put('/:id', middlewares.verifyJWT, middlewares.isTE, classController.findOneAndUpdate);
export default ClassRouter;