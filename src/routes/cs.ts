import { Router } from "express";
import csController from "../controllers/cs";
import middlewares from "../middlewares";
import { PositionTe, ROLE } from "../global/enum";
const CSRouter = Router();

CSRouter.post('', middlewares.verifyJWT, middlewares.acceptRole(PositionTe.LEADER, ROLE.CS), csController.createCs);
CSRouter.put('/:id', middlewares.verifyJWT, middlewares.acceptRole(PositionTe.LEADER, ROLE.CS), csController.findByIdAndUpdate);
CSRouter.get('', middlewares.verifyJWT, middlewares.acceptRole(undefined, ROLE.TE, ROLE.CS), csController.getAll);
export default CSRouter;