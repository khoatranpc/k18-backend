import { Router } from "express";
import areaController from "../controllers/area";
const AreaRouter = Router();

AreaRouter.get('', areaController.get);
AreaRouter.post('', areaController.create);
AreaRouter.put('/:id', areaController.update);
export default AreaRouter;