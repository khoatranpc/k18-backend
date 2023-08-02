import { Request, Response } from "express";
import { resClientData } from "../../utils";
import FeedbackResponseModel from "../../models/feedbackResponse";

const feedbackResponseController = {
    sendResponseFromForm: async (req: Request, res: Response) => {
        try {
            const dataResponse = req.body;
            const insertResponse = await FeedbackResponseModel.create(dataResponse);
            resClientData(res, 201, insertResponse);
        } catch (error: any) {
            resClientData(res, 500, null, error.message);
        }
    }
};
export default feedbackResponseController;