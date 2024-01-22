import { Request, Response } from "express";
import { getProjectionByString, resClientData } from "../../utils";
import RequetsOnLeaveModel from "../../models/teacherRequestOnLeave";

const requestOnLeaveController = {
    createRequest: async (req: Request, res: Response) => {
        try {
            await RequetsOnLeaveModel.create(req.body);
            resClientData(req, res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    getListRequest: async (req: Request, res: Response) => {
        try {
            const { fields, currentPage, recordOnPage, } = req.query;
            const totalListRequest = await RequetsOnLeaveModel.count({});
            const listRequest = await RequetsOnLeaveModel
                .find({}, getProjectionByString(fields as string))
                .populate({
                    path: 'classSessionId',
                    select: getProjectionByString(fields as string),
                    populate: {
                        path: 'weekdayTimeScheduleId locationId',
                        select: getProjectionByString(fields as string)
                    }
                })
                .populate('teacherId', getProjectionByString(fields as string))
                .skip((Number(recordOnPage) * Number(currentPage)) - Number(recordOnPage)).limit(Number(recordOnPage));
            const data = {
                data: listRequest,
                totalPage: Math.ceil(totalListRequest / Number(recordOnPage)),
                currentPage: Number(currentPage) || '',
                recordOnPage: Number(recordOnPage || '')
            }
            resClientData(req, res, 201, data, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
};

export default requestOnLeaveController;