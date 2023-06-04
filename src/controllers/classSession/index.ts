import { Request, Response } from "express";
import { getDB } from "../../database/config";
import { getProjection, resClientData } from "../../utils";
import ClassSessionModel from "../../models/classSession";
import TeacherScheduleModel from "../../models/teacherSchedule";
import ClassModel from "../../models/class";
import TimeScheduleModel from "../../models/timeSchedule";
import { Obj } from "../../global/interface";
import BookTeacherModel from "../../models/bookTeacher";
import { ObjectId } from "mongodb";

const classSessionController = {
    getClassSessionByClassId: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { classId } = req.params;
                const { fields } = req.query;
                const crrClassSession = await ClassSessionModel.find({
                    classId
                }, { ...fields && getProjection(...fields as Array<string>) })
                    .populate('weekdayTimeScheduleId', { ...fields && getProjection(...fields as Array<string>) });
                resClientData(res, 200, crrClassSession);
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message)
            }
            await disconnect();
        })
    },
    getTeacherInSession: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { sessionId } = req.params;
                const { fields } = req.query;
                const listTeacher = await TeacherScheduleModel.find({
                    classSessionId: sessionId
                }, { ...fields && getProjection(...fields as Array<string>) }).populate('teacherId', { ...fields && getProjection(...fields as Array<string>) });
                resClientData(res, 200, listTeacher);
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message);
            }
            await disconnect();
        })
    },
    handleClassSession: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { options } = req.query;
                switch (options) {
                    case 'ADD':
                        const { classId, sessionNumber, date, weekdayTimeScheduleId } = req.body;
                        if (!classId || !sessionNumber || !date || !weekdayTimeScheduleId) {
                            throw new Error('Bạn cần phải truyền đầy đủ các trường classId, sessionNumber, date, weekdayTimeScheduleId!');
                        }
                        const crrClass = await ClassModel.findById(classId);
                        if (!crrClass) throw new Error('Không tìm thấy lớp!');

                        const crrTime = await TimeScheduleModel.findById(weekdayTimeScheduleId);
                        if (!crrTime) throw new Error('Không tìm thấy lịch này!');

                        const existedSessionNumber = await ClassSessionModel.findOne({
                            sessionNumber
                        });
                        if (existedSessionNumber) throw new Error('Đã có buổi học này!');
                        const listSession: Obj[] = [];
                        const listNewScheduleForTeacher: Obj[] = [];

                        const requestBookTeacher = await BookTeacherModel.find({
                            classId
                        }, { locationId: 1, teacherRegister: 1 });
                        if (!requestBookTeacher) throw new Error('Lớp học chưa có bản yêu cầu book giáo viên!');
                        requestBookTeacher.forEach((item) => {
                            const teacherActiveInRecordBookTeacher = item.teacherRegister.filter((record) => record.accept);
                            const recordClassSession = {
                                classId,
                                locationId: item.locationId,
                                sessionNumber,
                                date,
                                weekdayTimeScheduleId,
                                isOH: false,
                                _id: new ObjectId()
                            };
                            teacherActiveInRecordBookTeacher.forEach(teacher => {
                                const newScheduleForTeacher = {
                                    teacherId: teacher.idTeacher,
                                    classSessionId: recordClassSession._id,
                                    role: teacher.roleRegister,
                                    active: false,
                                    isReplaceTeacher: false
                                };
                                listNewScheduleForTeacher.push(newScheduleForTeacher);
                            })
                            listSession.push(recordClassSession);
                        });
                        const insertListSession = await ClassSessionModel.insertMany(listSession);
                        const insertSchedule = await TeacherScheduleModel.insertMany(listNewScheduleForTeacher);
                        if (insertSchedule && insertListSession) {
                            resClientData(res, 201, {
                                listSession,
                                listNewScheduleForTeacher
                            });
                        } else {
                            if (!insertListSession) throw new Error('Thêm buổi học thất bại!');
                            if (!insertSchedule) throw new Error('Thêm lịch cho giáo viên thất bại!');
                        }
                        break;
                    case 'DELETE':
                        const { classSessionId, ssN } = req.body;
                        // delete class session
                        await ClassSessionModel.deleteMany({
                            sessionNumber: ssN,
                        });
                        // delete for teacher schedule
                        await TeacherScheduleModel.deleteMany({
                            classSessionId
                        });
                        resClientData(res, 201, {});
                        break;
                    case 'UPDATE':
                        const { ssNumber, dateSs, document, weekdayTimeId } = req.body;
                        await ClassSessionModel.updateMany({
                            sessionNumber: {}
                        }, {
                            ssNumber,
                            dateSs,
                            document,
                            weekdayTimeId
                        })
                        break;
                    default:
                        throw new Error('Không thuộc trong các options cung cấp!')
                }
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
            }
            await disconnect();
        })
    }
};
export default classSessionController;