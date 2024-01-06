import { Router } from "express";
import folderController from "../controllers/folder";
import middlewares from "../middlewares";

const FolderRouter = Router();
FolderRouter.use(middlewares.verifyJWT);
FolderRouter.get('', folderController.getAllFolder);
FolderRouter.post('', middlewares.isTE, folderController.create);
FolderRouter.put('/:id', middlewares.isTE, folderController.updateFolder)
export default FolderRouter;