import { Request, Response } from "express";
import { getProjection, resClientData } from "../../utils";
import TeacherRegisterCourseModel from "../../models/teacherRegisterCourse";
import { RequestMid } from "../../middlewares";
import { ROLE } from "../../global/enum";
import TeacherModel from "../../models/teacher";

const teacherRegisterCourseController = {
    getDataByListTeacherId: async (req: RequestMid, res: Response) => {
        try {
            const crrAccount = req.acc;
            const { listTeacherId, fields } = req.query;
            if (crrAccount?.role !== ROLE.TE) {
                const currentUser = await TeacherModel.findOne({ idAccount: crrAccount?.id }, { _id: 1 });
                const record = await TeacherRegisterCourseModel.findOne({
                    idTeacher: currentUser?._id
                }).populate('coursesRegister.idCourse coursesRegister.levelHandle', { ...fields && getProjection(...fields as Array<string>) });
                resClientData(req, res, 200, record);
            } else {
                if (!listTeacherId) {
                    const listRecord = await TeacherRegisterCourseModel.find({}, { ...fields && getProjection(...fields as Array<string>) })
                        .populate('coursesRegister.idCourse coursesRegister.levelHandle', { ...fields && getProjection(...fields as Array<string>) });
                    resClientData(req, res, 200, listRecord);
                } else {
                    const listRecord = await TeacherRegisterCourseModel.find({
                        idTeacher: {
                            $in: listTeacherId!.toString().split(',')
                        }
                    }, { ...fields && getProjection(...fields as Array<string>) })
                        .populate('coursesRegister.idCourse coursesRegister.levelHandle', { ...fields && getProjection(...fields as Array<string>) });
                    resClientData(req, res, 200, listRecord);
                }
            }
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
    updateRecordRegisterCourse: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await TeacherRegisterCourseModel.findByIdAndUpdate(id, req.body);
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    }
};
export default teacherRegisterCourseController;