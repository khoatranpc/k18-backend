import { Request, Response } from "express";
import { getDB } from "../../database/config";
import { getProjection, resClientData } from "../../utils";
import TeacherModel from "../../models/teacher";
import { RequestMid } from "../../middlewares";
import { ROLE } from "../../global/enum";

const teacherController = {
    getAll: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { fields } = req.query;
                const listTeacher = await TeacherModel.find({}, { ...fields && getProjection(...fields as Array<string>) });
                resClientData(res, 200, listTeacher);
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message);
            }
            await disconnect();
        });
    },
    getOne: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { id } = req.params;
                const { fields } = req.query;
                const listTeacher = await TeacherModel.findById(id, { ...fields && getProjection(...fields as Array<string>) });
                resClientData(res, 200, listTeacher);
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message);
            }
            await disconnect();
        });
    },
    findByIdAndUpdate: (req: RequestMid, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { id } = req.params;
                if (req.acc?.role === ROLE.TE) {
                    await TeacherModel.findByIdAndUpdate(id, req.body);
                } else if (req.acc?.role === ROLE.TEACHER) {
                    const crrTeacher = await TeacherModel.findOne({ idAccount: req.acc?.id as string });
                    if (!crrTeacher) throw new Error('Không tìm thấy giáo viên!');
                    if (crrTeacher._id.toString() !== id) throw new Error('Bạn không có quyền thực hiện hành động!');
                    await TeacherModel.findByIdAndUpdate(id, req.body, { new: true });
                }
                resClientData(res, 201, {});
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
            }
            await disconnect();
        });
    }
}
export default teacherController;