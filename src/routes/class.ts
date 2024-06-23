import { Router } from "express";
import classController from "../controllers/class";
import middlewares from "../middlewares";
import { validate } from "../utils/validate";
import { createClassSchema } from "../controllers/class/validate";
import { PositionTe, ROLE } from "../global/enum";

const ClassRouter = Router();

ClassRouter.get('', middlewares.verifyJWTnotRequired, classController.getAll);
ClassRouter.get('/:id', middlewares.verifyJWT, classController.findOneById);
ClassRouter.post('', middlewares.verifyJWT, middlewares.acceptRole(PositionTe.LEADER, ROLE.TE, ROLE.CS), validate(createClassSchema), classController.create);
ClassRouter.put('/:id', middlewares.verifyJWT, middlewares.acceptRole(undefined, ROLE.TE, ROLE.CS), classController.findOneAndUpdate);
export default ClassRouter;