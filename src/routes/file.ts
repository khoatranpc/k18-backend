import { Router } from "express";
import fileController from "../controllers/file";
import middlewares from "../middlewares";

const FileRouter = Router();
FileRouter.use(middlewares.verifyJWT);
FileRouter.get('', fileController.getAllFile);
FileRouter.post('', middlewares.isTE, fileController.createFile);
FileRouter.put('/:id', middlewares.isTE, fileController.updateFile);
FileRouter.delete('/:id', middlewares.isTE, fileController.deleteFile);

export default FileRouter;