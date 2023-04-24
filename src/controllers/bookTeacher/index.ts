import { Request, Response } from "express";
import { getDB } from "../../database/config";
import { resClientData } from "../../utils";
import BookTeacherModel from "../../models/bookTeacher";
import ClassModel from "../../models/class";

const bookTeacherController = {
    create: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { listRequest } = req.body;
                const createBookTeacherRequest = await BookTeacherModel.insertMany(listRequest);
                resClientData(res, 201, createBookTeacherRequest, 'Thành công!');
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
            }
            await disconnect();
        })
    },
    getByClassId: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { classId } = req.params;
                const bookTeachersByClassId = await ClassModel.find({
                    _id: classId
                })
                resClientData(res, 200, bookTeachersByClassId, 'Thành công!');
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message);
            }
            await disconnect();
        })
    }
};

export default bookTeacherController;