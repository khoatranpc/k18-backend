import { Router } from "express";
import requestOnLeaveController from "../controllers/requestOnLeave";
import middlewares from "../middlewares";

const RequestOnleaveRouter = Router();

RequestOnleaveRouter.post('', middlewares.verifyJWT, requestOnLeaveController.createRequest)
RequestOnleaveRouter.get('', middlewares.verifyJWT, middlewares.isTE, requestOnLeaveController.getListRequest)

export default RequestOnleaveRouter;