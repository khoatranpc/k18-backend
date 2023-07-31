import { Request, Response } from "express";
import { getProjection, resClientData } from "../../utils";
import FeedbackModel from "../../models/feedback";
import { Obj } from "../../global/interface";

const feedbackController = {
    getRecordByMonth: async (req: Request, res: Response) => {
        try {
            const { date, fields, codeClassText, time, enabled, done } = req.query;
            const startDate = new Date(Number((date as Obj)?.year as string), Number((date as Obj)?.month as string) - 1, 1);
            const endDate = new Date(Number((date as Obj)?.year as string), Number((date as Obj)?.month as string), 0);
            const getList = await FeedbackModel.find({
                date: {
                    $lte: endDate,
                    $gte: startDate
                },
                enabled: {
                    $in: enabled
                },
                time: {
                    $in: time
                },
                done: done,
                ...codeClassText ? {
                    codeClassText: {
                        '$regex': codeClassText,
                        '$options': 'i'
                    }
                } : {},
            }, { ...fields && getProjection(...fields as Array<string>) }).populate('codeClass', { ...fields && getProjection(...fields as Array<string>) });
            resClientData(res, 200, getList);
        } catch (error: any) {
            resClientData(res, 500, null, error.message);
        }
    },
    updateRecord: async (req: Request, res: Response) => {
        try {
            const { feedbackId } = req.params;
            const { enabled, done } = req.body;
            const update = await FeedbackModel.findOneAndUpdate({
                _id: feedbackId
            }, {
                enabled,
                done
            }, {
                new: true
            });
            resClientData(res, 201, update);
        } catch (error: any) {
            resClientData(res, 403, null, error.message);
        }
    }
};
export default feedbackController;