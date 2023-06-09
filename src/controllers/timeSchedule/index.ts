import { Request, Response } from "express";
import { resClientData } from "../../utils";
import TimeScheduleModel from "../../models/timeSchedule";

const timeScheduleController = {
    create: async (req: Request, res: Response) => {
        try {
            const { start, end, weekday } = req.body;
            await TimeScheduleModel.create({
                start,
                end,
                weekday
            })
            resClientData(res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message)
        }
    },
    getAll: async (_: Request, res: Response) => {
        try {
            const timeSchedules = await TimeScheduleModel.find({});
            resClientData(res, 200, timeSchedules, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 500, undefined, error.message)
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { start, end, weekday } = req.body;
            await TimeScheduleModel.findByIdAndUpdate(id, {
                start,
                end,
                weekday
            }, { new: true });
            resClientData(res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message);
        }
    },
};
export default timeScheduleController;