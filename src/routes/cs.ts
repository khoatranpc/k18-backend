import { Router } from "express";
import csController from "../controllers/cs";
import middlewares from "../middlewares";
import { PositionTe, ROLE } from "../global/enum";
import upload from "../utils/multer";
const CSRouter = Router();

CSRouter.post('', middlewares.verifyJWT, middlewares.acceptRole(PositionTe.LEADER, ROLE.TE, ROLE.CS), upload.single('image'), csController.createCs);
CSRouter.put('/:id', middlewares.verifyJWT, middlewares.acceptRole(PositionTe.LEADER, ROLE.TE, ROLE.CS), upload.single('image'), csController.findByIdAndUpdate);
CSRouter.get('', middlewares.verifyJWT, middlewares.acceptRole(undefined, ROLE.TE, ROLE.CS), csController.getAll);
export default CSRouter;