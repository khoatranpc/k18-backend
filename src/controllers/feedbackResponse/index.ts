import { Request, Response } from "express";
import { getProjection, resClientData } from "../../utils";
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
    },
    getListRecordResponse: async (req: Request, res: Response) => {
        try {
            // with filter
            /**
             * sortBy:{
             * type: ASC|DESC,
             * field: string
             * }
             */
            const {
                fields,
                currentPage,
                recordOnPage,

                // month,
                // year,
                // studentName,
                // phoneNumber,
                // course,
                // codeClass,
                // groupNumber,
                // timeCollectFeedback,
                // sortBy,

            } = req.query;

            const listResponse = await FeedbackResponseModel.find({}, { ...fields && getProjection(...fields as Array<string>) }).sort({
                createdAt: -1
            })
                .skip((Number(recordOnPage) * Number(currentPage)) - Number(recordOnPage)).limit(Number(recordOnPage))
                .populate('course codeClass groupNumber feedbackId', { ...fields && getProjection(...fields as Array<string>) });
            resClientData(res, 201, listResponse);

        } catch (error: any) {
            resClientData(res, 500, null, error.message);
        }
    }
};
export default feedbackResponseController;