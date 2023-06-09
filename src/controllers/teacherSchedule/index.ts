import { Request, Response } from "express";
import TeacherScheduleModel from "../../models/teacherSchedule";
import { getProjection, resClientData } from "../../utils";

const teacherScheduleController = {
    getOneByidTeacher: async (req: Request, res: Response) => {
        try {
            const { teacherId } = req.params;
            const { fields } = req.query;
            const teacherSchedule = await TeacherScheduleModel.find({
                teacherId
            }, { ...fields && getProjection(...fields as Array<string>) })
                .populate('classSessionId', { ...fields && getProjection(...fields as Array<string>) })
                .populate({
                    path: 'classSessionId',
                    populate: {
                        path: 'classId locationId weekdayTimeScheduleId',
                        select: fields,
                    },
                })
                ;
            resClientData(res, 200, teacherSchedule);
        } catch (error) {
            resClientData(res, 403, undefined);
        }
    }
};
export default teacherScheduleController;