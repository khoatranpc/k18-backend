import { Request, Response } from "express";
import { getDB } from "../../database/config";
import { getProjection, resClientData } from "../../utils";
import ClassModel from "../../models/class";

const classController = {
    getAll: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { fields } = req.query;
                const classes = await ClassModel.find({}, { ...fields && getProjection(...fields as Array<string>) })
                    .populate('courseId courseLevelId timeSchedule', { ...fields && getProjection(...fields as Array<string>) });

                resClientData(res, 200, classes, 'Thành công!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message);
                await disconnect();
            }
        });
    },
    create: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { courseLevelId, courseId, codeClass, dayRange, timeSchedule } = req.body;
                await ClassModel.create({
                    courseLevelId,
                    courseId,
                    codeClass,
                    dayRange,
                    timeSchedule
                });
                resClientData(res, 201, {}, 'Thành công!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
                await disconnect();
            }
        });;
    },
    findOneById: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { id } = req.params;
                const { fields } = req.query;
                const crrClass = await ClassModel.findById(id)
                    .populate('courseId courseLevelId timeSchedule', { ...fields && getProjection(...fields as Array<string>) });

                if (!crrClass) throw new Error('Không tồn tại lớp!');
                resClientData(res, 200, crrClass, 'Tìm thấy!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 404, undefined, error.message);
                await disconnect();
            }
        });
    },
    findOneAndUpdate: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { id } = req.params;
                // const { fields } = req.query;
                // const crrClass = await ClassModel.findById(id)
                //     .populate('courseId courseLevelId', { ...fields && getProjection(...fields as Array<string>) });
                const { dayRange, codeClass, courseId, courseLevelId, timeSchedule, status } = req.body;
                await ClassModel.findByIdAndUpdate(id, {
                    dayRange,
                    codeClass,
                    courseId,
                    courseLevelId,
                    timeSchedule,
                    status
                });
                resClientData(res, 201, {}, 'Thành công!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
                await disconnect();
            }
        });
    },
};
export default classController;