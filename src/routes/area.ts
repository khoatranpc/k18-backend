import { Router } from "express";
import areaController from "../controllers/area";
const AreaRouter = Router();

AreaRouter.get('',areaController.get)
export default AreaRouter;