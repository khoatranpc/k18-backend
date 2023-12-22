import { Router } from "express";
import documentController from "../controllers/document";
import { validate } from "../utils/validate";
import { createDocument } from "../controllers/document/validate";
import middlewares from "../middlewares";
const DocumentRouter = Router();

DocumentRouter.get('', documentController.getDoc);
DocumentRouter.post('', middlewares.verifyJWT, middlewares.isTE, validate(createDocument), documentController.createDoc);
DocumentRouter.delete('/:id', middlewares.verifyJWT, middlewares.isTE, documentController.deleteDoc);
DocumentRouter.put('/:id', middlewares.verifyJWT, middlewares.isTE, documentController.updateDocById);
export default DocumentRouter;