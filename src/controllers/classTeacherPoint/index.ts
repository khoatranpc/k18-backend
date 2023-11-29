import { Request, Response } from "express";
import { resClientData } from "../../utils";
import ClassTeacherPointModel from "../../models/classTeacherPoint";

const classTeacherPointController = {
    getClassTeacherPointByListClassId: async (req: Request, res: Response) => {
        try {
            const { listClassId } = req.query;
            const listClassTeacherPoint = await ClassTeacherPointModel.find({
                classId: {
                    $in: String(listClassId).split(',')
                },
            }, {
                feedbackId: 0
            });
            resClientData(req, res, 200, listClassTeacherPoint);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    }
};
export default classTeacherPointController;