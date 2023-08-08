import { Request, Response } from "express";
import { getProjection, resClientData } from "../../utils";
import FeedbackResponseModel from "../../models/feedbackResponse";
import FeedbackModel from "../../models/feedback";
import { Obj } from "../../global/interface";

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

                codeClass,
                timeCollect,

                // month,
                // year,
                // phoneNumber,
                // course,
                // codeClass,
                // timeCollectFeedback,
                // sortBy,

            } = req.query;
            if (codeClass && timeCollect) {
                const recordFeedback = await FeedbackModel.findOne({
                    codeClass: codeClass,
                    time: Number(timeCollect) || 1
                });
                if (!recordFeedback) {
                    resClientData(res, 200, [], 'Không tìm thấy thông tin!');
                } else {
                    const listResponseFeedback = await FeedbackResponseModel.find({
                        feedbackId: recordFeedback?._id,
                    }).sort({
                        createdAt: -1
                    })
                        .populate('course codeClass groupNumber feedbackId', { ...fields && getProjection(...fields as Array<string>) })
                    resClientData(res, 200, listResponseFeedback);
                }
            } else {
                const totalRecord = await FeedbackResponseModel.countDocuments({});
                const listResponse = await FeedbackResponseModel.find({}, { ...fields && getProjection(...fields as Array<string>) }).sort({
                    createdAt: -1
                })
                    .skip((Number(recordOnPage) * Number(currentPage)) - Number(recordOnPage)).limit(Number(recordOnPage))
                    .populate('course codeClass groupNumber feedbackId', { ...fields && getProjection(...fields as Array<string>) });
                resClientData(res, 200, {
                    list: listResponse,
                    totalPage: Math.ceil(totalRecord / Number(recordOnPage)),
                    currentPage: Number(currentPage) || '',
                    recordOnPage: Number(recordOnPage || '')
                });
            }
        } catch (error: any) {
            resClientData(res, 500, null, error.message);
        }
    }
};
export default feedbackResponseController;