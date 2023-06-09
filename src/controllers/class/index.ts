import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDateOfWeekday, getProjection, getWeekDay, resClientData } from "../../utils";
import ClassModel from "../../models/class";
import { STATUS_CLASS, WEEKDAY } from "../../global/enum";
import { Obj } from "../../global/interface";
import BookTeacherModel from "../../models/bookTeacher";
import ClassSessionModel from "../../models/classSession";
import TeacherScheduleModel from "../../models/teacherSchedule";

const classController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const { fields, recordOnPage, currentPage } = req.query;
            let classes;
            if (recordOnPage && currentPage) {
                classes = await ClassModel.find({}, { ...fields && getProjection(...fields as Array<string>) })
                    .sort({
                        createdAt: -1
                    })
                    .skip((Number(recordOnPage) * Number(currentPage)) - Number(recordOnPage)).limit(Number(recordOnPage))
                    .populate('courseId courseLevelId timeSchedule', { ...fields && getProjection(...fields as Array<string>) });
            }
            else {
                classes = await ClassModel.find({}, { ...fields && getProjection(...fields as Array<string>) })
                    .sort({
                        createdAt: -1
                    })
                    .populate('courseId courseLevelId timeSchedule', { ...fields && getProjection(...fields as Array<string>) });
            }
            const totalClasses = await ClassModel.find({});
            const getListCurrentClassId = classes.map((item) => item._id);
            const listBookTeacher = await BookTeacherModel.find({
                classId: {
                    $in: getListCurrentClassId
                },
            }, {
                teacherRegister: 1,
                classId: 1,

            }).populate('teacherRegister.idTeacher', { fullName: 1, _id: 1 });
            const newRefListClass = classes.map((item) => {
                const findRecord = listBookTeacher.filter((record) => {
                    return record.classId?.toString() === item._id.toString()
                });
                return {
                    ...item.toObject(),
                    recordBookTeacher: findRecord
                }
            })
            const dataSend = {
                classes: newRefListClass,
                totalPage: Math.ceil(totalClasses.length / Number(recordOnPage)),
                currentPage: Number(currentPage) || '',
                recordOnPage: Number(recordOnPage || '')
            }

            resClientData(res, 200, dataSend, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 500, undefined, error.message);
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const { courseLevelId, courseId, codeClass, dayRange, timeSchedule } = req.body;
            const findExistClassCode = await ClassModel.findOne({
                codeClass
            });
            if (findExistClassCode) throw new Error('Mã lớp này đã tồn tại!');
            await ClassModel.create({
                courseLevelId,
                courseId,
                codeClass,
                dayRange,
                timeSchedule
            });
            resClientData(res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message);
        }
    },
    findOneById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { fields } = req.query;
            const crrClass = await ClassModel.findById(id)
                .populate('courseId courseLevelId timeSchedule', { ...fields && getProjection(...fields as Array<string>) });

            if (!crrClass) throw new Error('Không tồn tại lớp!');
            resClientData(res, 200, crrClass, 'Tìm thấy!');
        } catch (error: any) {
            resClientData(res, 404, undefined, error.message);
        }
    },
    findOneAndUpdate: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { dayRange, codeClass, courseId, courseLevelId, timeSchedule, status } = req.body;
            const crrClass = await ClassModel.findById(id).populate('timeSchedule');
            if (!crrClass) throw new Error('Cập nhật thất bại!');

            if (dayRange) crrClass.dayRange = dayRange;
            if (codeClass) crrClass.codeClass = codeClass;
            if (courseId) crrClass.courseId = courseId;
            if (courseLevelId) crrClass.courseLevelId = courseLevelId;
            if (timeSchedule) crrClass.timeSchedule = timeSchedule;
            if (status) crrClass.status = status;

            await crrClass.save();
            if (status === STATUS_CLASS.RUNNING && crrClass.status !== STATUS_CLASS.RUNNING) {
                const findExistedClassSessionRecords = await ClassSessionModel.find({
                    classId: crrClass._id
                });
                if (findExistedClassSessionRecords.length !== 0) throw new Error('Đã có thông tin các buổi học!')
                const dayStart = new Date(crrClass.dayRange?.start as Date);
                const weekdayOfDayStart = getWeekDay(new Date((crrClass.dayRange?.start as Date)).getDay());
                const getIndexStartWeekday = getWeekDay(undefined, true, weekdayOfDayStart as WEEKDAY)

                const remainWeekday = crrClass.timeSchedule.find((item) => {
                    return (item as unknown as Obj).weekday !== weekdayOfDayStart;
                });

                const getIndexRemainWeekday = getWeekDay(undefined, true, (remainWeekday as unknown as Obj)?.weekday as WEEKDAY)

                let distanceWeekday = 0;
                if (getIndexRemainWeekday < getIndexStartWeekday) {
                    distanceWeekday = Math.abs(((getIndexStartWeekday as number) - (getIndexRemainWeekday as number)) - 1);
                } else {
                    distanceWeekday = (getIndexRemainWeekday as number) - (getIndexStartWeekday as number);
                }

                const listSession: Date[] = [];
                listSession.push(new Date(dayStart));
                const nextDaySession = getDateOfWeekday(new Date(crrClass.dayRange?.start as Date), distanceWeekday);
                listSession.push(new Date(nextDaySession));
                const day: {
                    day1?: Obj,
                    day2?: Obj
                } = {};

                for (let i = 0; i < crrClass.timeSchedule.length; i++) {
                    const crrItem = crrClass.timeSchedule[i] as unknown as Obj;
                    if (crrItem.weekday === weekdayOfDayStart) day.day1 = crrItem;
                    else {
                        day.day2 = crrItem;
                    }
                }
                for (let i = 0; i < 14; i++) {
                    if (i % 2 === 0) {
                        listSession.push(new Date(dayStart));
                    } else {
                        listSession.push(new Date(nextDaySession));
                    }
                }

                const crrRecordBookTeacher = await BookTeacherModel.find({
                    classId: crrClass._id
                });

                const listTeacherAccepted: Obj[] = [];
                const genListSessionDocument: Obj[] = [];
                listSession.forEach((item, index) => {
                    crrRecordBookTeacher.forEach((record) => {
                        const newSession = {
                            classId: crrClass._id,
                            locationId: record.locationId,
                            sessionNumber: index + 1,
                            date: item,
                            document: '',
                            weekdayTimeScheduleId: index % 2 === 0 ? day.day1?._id : day.day2?._id,
                            _id: new ObjectId()
                        }

                        crrRecordBookTeacher.forEach((recordBookTeacher) => {
                            const teacherAccepted = recordBookTeacher.teacherRegister.filter((teacher) => {
                                return teacher.accept === true && newSession.locationId?.toString() === recordBookTeacher.locationId?.toString()
                            });
                            teacherAccepted.forEach((recordTeacher) => {
                                listTeacherAccepted.push({
                                    locationId: newSession.locationId,
                                    classSessionId: newSession._id,
                                    teacherId: recordTeacher.idTeacher,
                                    role: recordTeacher.roleRegister,
                                    checked: false
                                });
                            })
                        });
                        genListSessionDocument.push(newSession);
                    });
                });

                await ClassSessionModel.insertMany(genListSessionDocument);
                const schedule = await TeacherScheduleModel.insertMany(listTeacherAccepted);

                resClientData(res, 201, {
                    schedule
                }, 'Thành công!');
            } else {
                throw new Error('Lớp đã bắt đầu!')
            }
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message);
        }
    },
};
export default classController;