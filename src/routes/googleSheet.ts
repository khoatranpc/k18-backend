import { Router } from "express";
import googleSheetController from "../controllers/googleSheet";

const GoogleSheetRouter = Router();

GoogleSheetRouter.get('', googleSheetController.writeToSheet);
export default GoogleSheetRouter;