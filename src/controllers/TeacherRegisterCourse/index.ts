import { Request, Response } from "express";
import { getProjection, resClientData } from "../../utils";
import TeacherRegisterCourseModel from "../../models/teacherRegisterCourse";

const teacherRegisterCourseController = {
    getDataByListTeacherId: async (req: Request, res: Response) => {
        try {
            const { listTeacherId, fields } = req.query;
            if (!listTeacherId) throw new Error('Thiếu listTeacherId!');
            const listRecord = await TeacherRegisterCourseModel.find({
                idTeacher: {
                    $in: listTeacherId!.toString().split(',')
                }
            }, { ...fields && getProjection(...fields as Array<string>) })
                .populate('coursesRegister.idCourse coursesRegister.levelHandle', { ...fields && getProjection(...fields as Array<string>) });
            resClientData(res, 200, listRecord);
        } catch (error: any) {
            resClientData(res, 500, undefined, error.message);
        }
    }
};
export default teacherRegisterCourseController;