import { Request, Response } from "express";
import { getProjection, resClientData } from "../../utils";
import TeacherModel from "../../models/teacher";
import { RequestMid } from "../../middlewares";
import { ROLE } from "../../global/enum";

const teacherController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const { fields, recordOnPage, currentPage } = req.query;
            let listTeacher;
            if (recordOnPage && currentPage) {
                listTeacher = await TeacherModel.find({}, { ...fields && getProjection(...fields as Array<string>) })
                    .skip((Number(recordOnPage) * Number(currentPage)) - Number(recordOnPage)).limit(Number(recordOnPage))
            } else {
                listTeacher = await TeacherModel.find({}, { ...fields && getProjection(...fields as Array<string>) });
            }
            const listTeacherLength = await TeacherModel.countDocuments({});
            const dataSend = {
                listTeacher: listTeacher,
                totalPage: Math.ceil(listTeacherLength / Number(recordOnPage)),
                currentPage: Number(currentPage) || '',
                recordOnPage: Number(recordOnPage || '')
            }

            resClientData(res, 200, dataSend);
        } catch (error: any) {
            resClientData(res, 500, undefined, error.message);
        }
    },
    getOne: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { fields } = req.query;
            const listTeacher = await TeacherModel.findById(id, { ...fields && getProjection(...fields as Array<string>) });
            resClientData(res, 200, listTeacher);
        } catch (error: any) {
            resClientData(res, 500, undefined, error.message);
        }
    },
    findByIdAndUpdate: async (req: RequestMid, res: Response) => {
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
    },
    findByEmail: async (req: Request, res: Response) => {
        try {
            const { email } = req.query;
            const listTeacher = await TeacherModel.find({
                email: {
                    "$regex": email as string,
                    "$options": "i"
                },
                isOffical: true
            }, {
                _id: 1,
                fullName: 1
            });
            resClientData(res, 200, listTeacher);

        } catch (error: any) {
            resClientData(res, 404, undefined, error.message);
        }
    }
}
export default teacherController;