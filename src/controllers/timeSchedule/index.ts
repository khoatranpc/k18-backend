import { Request, Response } from "express";
import { getDB } from "../../database/config";
import { resClientData } from "../../utils";
import TimeScheduleModel from "../../models/timeSchedule";

const timeScheduleController = {
    create: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { start, end, weekday } = req.body;
                await TimeScheduleModel.create({
                    start,
                    end,
                    weekday
                })
                resClientData(res, 201, {}, 'Thành công!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message)
                await disconnect();
            }
        })
    },
    getAll: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const timeSchedules = await TimeScheduleModel.find({});
                resClientData(res, 200, timeSchedules, 'Thành công!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message)
                await disconnect();
            }
        })
    },
    update: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { id } = req.params;
                const { start, end, weekday } = req.body;
                await TimeScheduleModel.findByIdAndUpdate(id, {
                    start,
                    end,
                    weekday
                });
                resClientData(res, 201, {}, 'Thành công!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
                await disconnect();
            }
        })
    },
};
export default timeScheduleController;