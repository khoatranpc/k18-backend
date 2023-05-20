import { Request, Response } from "express";
import { getDB } from "../../database/config";
import TeacherScheduleModel from "../../models/teacherSchedule";
import { getProjection, resClientData } from "../../utils";

const teacherScheduleController = {
    getOneByidTeacher: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
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
            await disconnect();
        })
    }
};
export default teacherScheduleController;