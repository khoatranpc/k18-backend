import { Request, Response } from "express";
import { getProjection, resClientData } from "../../utils";
import ClassSessionModel from "../../models/classSession";
import TeacherScheduleModel from "../../models/teacherSchedule";
import ClassModel from "../../models/class";
import TimeScheduleModel from "../../models/timeSchedule";
import { Obj } from "../../global/interface";
import BookTeacherModel from "../../models/bookTeacher";
import { ObjectId } from "mongodb";
import TeacherModel from "../../models/teacher";
import { ROLE_TEACHER, STATUS_CLASS } from "../../global/enum";

const classSessionController = {
    getClassSessionByClassId: async (req: Request, res: Response) => {
        try {
            const { classId } = req.params;
            const { fields } = req.query;
            const crrClassSession = await ClassSessionModel.find({
                classId
            }, { ...fields && getProjection(...fields as Array<string>) })
                .populate('weekdayTimeScheduleId', { ...fields && getProjection(...fields as Array<string>) });
            resClientData(req, res, 200, crrClassSession);
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message)
        }
    },
    getTeacherInSession: async (req: Request, res: Response) => {
        try {
            const { sessionId } = req.params;
            const { fields } = req.query;
            const listTeacher = await TeacherScheduleModel.find({
                classSessionId: sessionId
            }, { ...fields && getProjection(...fields as Array<string>) }).populate('teacherId', { ...fields && getProjection(...fields as Array<string>) });
            resClientData(req, res, 200, listTeacher);
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
    handleClassSession: async (req: Request, res: Response) => {
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
                        resClientData(req, res, 201, {
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
                    resClientData(req, res, 201, {});
                    break;
                case 'UPDATE':
                    const { ssNumber, dateSs, document, weekdayTimeId } = req.body;
                    await ClassSessionModel.updateMany({
                        sessionNumber: {}
                    }, {
                        sessionNumber: ssNumber,
                        date: dateSs,
                        document,
                        weekdayTimeId
                    }, {
                        new: true
                    });
                    resClientData(req, res, 201, {});
                    break;
                case 'RAN':
                    const { ssNumberRan, sessionId } = req.body;
                    if (!ssNumberRan) throw new Error('Thiếu buổi học số (ssNumberRan)!');
                    if (!sessionId) throw new Error('Thiếu id  buổi học (sessionId)!');
                    if (!Array.isArray(sessionId)) throw new Error('sessionId phải là 1 mảng!');
                    await ClassSessionModel.updateMany({
                        sessionNumber: ssNumberRan,
                    }, {
                        ran: true
                    }, {
                        new: true
                    });
                    const checkedAllTeacherInSession = await TeacherScheduleModel.updateMany({
                        'classSessionId': {
                            $in: [sessionId]
                        }
                    }, {
                        checked: true
                    }, {
                        new: true
                    });
                    resClientData(req, res, 201, checkedAllTeacherInSession);
                    break;
                default:
                    throw new Error('Không thuộc trong các options cung cấp!')
            }
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    handleTeacherOnLeave: async (req: Request, res: Response) => {
        try {
            const { classId, classSessionId, onLeave, currentTeacherId, replaceTeacherId } = req.body;
            const crrClassSession = await ClassSessionModel.findOne({
                classId,
                _id: classSessionId
            });
            if (!crrClassSession) throw new Error('Không tìm thấy bản ghi buổi học này!');

            const getRecordScheduleCrrTeacher = await TeacherScheduleModel.findOne({
                classSessionId,
                teacherId: currentTeacherId
            });
            if (!getRecordScheduleCrrTeacher) throw new Error('Giáo viên này không có lịch tại buổi học này!');

            const teacherReplace = await TeacherModel.findById(replaceTeacherId);
            if (!teacherReplace) throw new Error('Không tìm được giáo viên này!');
            switch (onLeave) {
                case "OFF":
                    getRecordScheduleCrrTeacher.isOff = true;
                    if (getRecordScheduleCrrTeacher.role === ROLE_TEACHER.SP) {
                        resClientData(req, res, 201, {});
                    } else {
                        // generate one record teacher schedule for replace teacher
                        const recordTeacherScheduleForRT = {
                            teacherId: replaceTeacherId,
                            classSessionId,
                            role: getRecordScheduleCrrTeacher.role,
                            isReplaceTeacher: true,
                            checked: false,
                            isOff: false
                        }
                        await TeacherScheduleModel.create(recordTeacherScheduleForRT);
                    }
                    await getRecordScheduleCrrTeacher.save();
                    resClientData(req, res, 201, {});
                    break;
                case 'REPLACE':
                    await TeacherScheduleModel.updateMany({
                        teacherId: currentTeacherId,
                        isOff: false,
                        checked: false
                    }, {
                        teacherId: replaceTeacherId
                    });
                    break;
                default:
                    break;
            }

        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    getAttendanceTeacher: async (req: Request, res: Response) => {
        try {
            const { sessionNumber, classId, fields } = req.query;
            const findAllClassSessionMappingSessionNumber = await ClassSessionModel.find({
                sessionNumber: sessionNumber,
                classId
            });
            const listTeacher = await TeacherScheduleModel.find({
                classSessionId: {
                    $in: findAllClassSessionMappingSessionNumber.map((item) => item._id)
                }
            }, { ...fields && getProjection(...fields as Array<string>) }).populate({
                path: 'classSessionId',
                populate: 'bookTeacher locationId',
                select: { ...fields && getProjection(...fields as Array<string>) }
            });
            resClientData(req, res, 200, listTeacher);
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
    generateListRecordTeacherSchedule: async (req: Request, res: Response) => {
        try {
            const { classId } = req.body;
            const currentClass = await ClassModel.findById(classId);
            if (currentClass) {
                const currentRecordBookTeacher = await BookTeacherModel.find({
                    classId
                });
                const mapListTeacher: Obj[] = [];
                currentRecordBookTeacher.forEach((item) => {
                    const listTeacher = item.toObject().teacherRegister.filter((teacher) => {
                        return teacher.accept && teacher.enroll;
                    }).map((record) => {
                        return {
                            ...record,
                            recordBookTeacherId: item._id
                        }
                    });
                    mapListTeacher.push(...listTeacher);
                });
                const countExistedRecord = await TeacherScheduleModel.countDocuments({
                    teacherId: {
                        $in: mapListTeacher.map((item) => item.idTeacher)
                    }
                });
                if (!countExistedRecord) {
                    const listRecordTimeKeeping: Obj[] = [];
                    const currentListClassSession = await ClassSessionModel.find({
                        classId
                    });
                    currentListClassSession.forEach((item) => {
                        const filterMatchingTeacher = mapListTeacher.filter((teacher) => teacher.recordBookTeacherId!.toString() === item.bookTeacher!.toString());
                        if (filterMatchingTeacher.length) {
                            filterMatchingTeacher.forEach((element) => {
                                const newRecord: Obj = {
                                    teacherId: element.idTeacher,
                                    role: element.roleRegister,
                                    classSessionId: item._id
                                };
                                listRecordTimeKeeping.push(newRecord);
                            });
                        }
                    });
                    await TeacherScheduleModel.insertMany(listRecordTimeKeeping);
                    resClientData(req, res, 201, {});
                } else {
                    throw new Error('Đã có bản ghi điểm danh giáo viên!');
                }
            }
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    }
};
export default classSessionController;