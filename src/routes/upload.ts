import { Router } from 'express';
import fileController from '../controllers/file';
import upload from '../utils/multer';
const UploadRouter = Router();
UploadRouter.post('', upload.single('file'), fileController.upload)
export default UploadRouter;