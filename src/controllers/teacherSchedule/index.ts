import { Request, Response } from "express";
import TeacherScheduleModel from "../../models/teacherSchedule";
import { getProjection, resClientData } from "../../utils";

const teacherScheduleController = {
    getOneByidTeacher: async (req: Request, res: Response) => {
        try {
            const { teacherId } = req.params;
            const { fields, month, year, startDate, endDate, option } = req.query;
            switch (option) {
                case 'WEEK':
                    // pending testing
                    // const
                    if (startDate && endDate) {
                        const tcSchedule = await TeacherScheduleModel.find({
                            teacherId,
                        }, { ...fields && getProjection(...fields as Array<string>) })
                            .populate({
                                path: 'classSessionId',
                                select: fields,
                                populate: {
                                    path: 'classId locationId weekdayTimeScheduleId',
                                    select: fields,
                                },
                                match: {
                                    date: {
                                        $gte: startDate,
                                        $lte: endDate
                                    }
                                }
                            }).exec().then((rs) => {
                                return rs.filter((item) => item.classSessionId !== null).sort((a, b) => ((a.classSessionId as any).sessionNumber) - ((b.classSessionId as any).sessionNumber));
                            })
                    }
                    break;
                case 'MONTH':
                    const getMonth = Number(month);
                    const getYear = Number(year);

                    const middleDate = new Date();
                    middleDate.setFullYear(getYear, getMonth - 1);

                    const prevDate = new Date();
                    prevDate.setFullYear(getYear, getMonth - 2);
                    prevDate.setDate(1);

                    const nextDate = new Date();
                    nextDate.setFullYear(getYear, getMonth + 1);
                    nextDate.setDate(1);

                    const listRecordSchedule = await TeacherScheduleModel.find({
                        teacherId
                    }, { ...fields && getProjection(...fields as Array<string>) })
                        .populate({
                            path: 'classSessionId',
                            select: fields,
                            match: {
                                date: {
                                    $gte: prevDate,
                                    $lte: nextDate
                                }
                            },
                            populate: {
                                path: 'classId locationId weekdayTimeScheduleId',
                                select: fields,
                            },
                        })
                        .exec().then((rs) => {
                            return rs.filter((item) => item.classSessionId !== null).sort((a, b) => ((a.classSessionId as any).sessionNumber) - ((b.classSessionId as any).sessionNumber));
                        })

                    resClientData(res, 200, listRecordSchedule);
                    break;
                default:
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
                        });

                    resClientData(res, 200, teacherSchedule);
                    break;
            }
        } catch (error) {
            resClientData(res, 403, undefined);
        }
    }
};
export default teacherScheduleController;