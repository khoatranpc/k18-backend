import { Request, Response } from "express";
import { getDB } from "../../database/config";
import { getProjection, resClientData } from "../../utils";
import ClassSessionModel from "../../models/classSession";

const classSessionController = {
    getClassSessionByClassId: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { classId } = req.params;
                const { fields } = req.query;
                const crrClassSession = await ClassSessionModel.find({
                    classId
                }, { ...fields && getProjection(...fields as Array<string>) })
                    .populate('weekdayTimeScheduleId', { ...fields && getProjection(...fields as Array<string>) });
                resClientData(res, 200, crrClassSession);
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message)
            }
            await disconnect();
        })
    }
};
export default classSessionController;