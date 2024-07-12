import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDateOfWeekday, getProjection, getWeekDay, resClientData } from "../../utils";
import ClassModel from "../../models/class";
import { ROLE, STATUS_CLASS, WEEKDAY } from "../../global/enum";
import { Obj } from "../../global/interface";
import BookTeacherModel from "../../models/bookTeacher";
import ClassSessionModel from "../../models/classSession";
import TeacherScheduleModel from "../../models/teacherSchedule";
import FeedbackModel from "../../models/feedback";
import { RequestMid } from "../../middlewares";
import TeacherRegisterCourseModel from "../../models/teacherRegisterCourse";

const classController = {
    getAll: async (req: RequestMid, res: Response) => {
        try {
            const { fields, recordOnPage, currentPage, listId, status, forRecruitment, course, codeClass, date, isDelete } = req.query;
            let classes;
            let filter;
            if (listId) {
                filter = {
                    _id: {
                        $in: listId
                    },
                    ...isDelete ? {
                        isDelete: isDelete
                    } : {},
                };
                classes = await ClassModel.find(filter, { ...fields && getProjection(...fields as Array<string>) })
                    .populate('courseId courseLevelId timeSchedule', { ...fields && getProjection(...fields as Array<string>), _id: 1 });
            }
            else if (recordOnPage && currentPage) {
                const role = req.acc?.role;
                let listCourseFilter: any[] = [];
                let listClassTcReg: any[] = [];
                if (role === ROLE.TEACHER) {
                    const record = await TeacherRegisterCourseModel.findOne({
                        idTeacher: req.acc?.userId
                    });
                    const listCourseRegister = record?.coursesRegister.map(item => item.idCourse) ?? [];
                    listCourseFilter = listCourseFilter.concat(listCourseRegister);
                    const listClassTeacherRegister = await BookTeacherModel.find({
                        'teacherRegister.idTeacher': req.acc?.userId
                    });
                    listClassTcReg = listClassTeacherRegister.map((item) => item.classId);
                }
                filter = {
                    ...isDelete ? {
                        isDelete: isDelete
                    } : {},
                    ...status ? (status === 'ALL' ? {
                    } : { status }) : {},
                    ...role === ROLE.TEACHER ? {
                        '$or': [
                            {
                                '$and': [
                                    { status: STATUS_CLASS.PREOPEN },
                                    {
                                        courseId: {
                                            '$in': listCourseFilter
                                        },
                                    }
                                ]
                            },
                            {
                                '_id': {
                                    '$in': listClassTcReg
                                }
                            },
                        ]
                    } : {},
                    ...course ? {
                        courseId: role === ROLE.TEACHER ? {
                            '$in': listCourseFilter
                        } : course
                    } : {},
                    ...codeClass ? {
                        codeClass: {
                            "$regex": codeClass,
                            "$options": 'i'
                        }
                    } : {},
                    ...date ? {
                        "dayRange.start": {
                            $gte: new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth(), 1), // Bắt đầu từ ngày đầu tiên của tháng
                            $lt: new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth() + 1, 1)
                        }
                    } : {}
                };
                classes = await ClassModel.find(filter, { ...fields && getProjection(...fields as Array<string>), _id: 1 })
                    .sort({
                        createdAt: -1
                    })
                    .skip((Number(recordOnPage) * Number(currentPage)) - Number(recordOnPage)).limit(Number(recordOnPage))
                    .populate('courseId courseLevelId timeSchedule', { ...fields && getProjection(...fields as Array<string>), _id: 1 });
            }
            else {
                filter = {
                    ...codeClass ? { codeClass } : {},
                    ...isDelete ? {
                        isDelete: isDelete
                    } : {},
                    ...date ? {
                        "dayRange.start": {
                            $gte: new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth(), 1), // Bắt đầu từ ngày đầu tiên của tháng
                            $lt: new Date(new Date(date as string).getFullYear(), new Date(date as string).getMonth() + 1, 1)
                        }
                    } : {}
                };
                classes = await ClassModel.find(filter, { ...fields && getProjection(...fields as Array<string>), _id: 1 })
                    .sort({
                        createdAt: -1
                    })
                    .populate('courseId courseLevelId timeSchedule', { ...fields && getProjection(...fields as Array<string>), _id: 1 });
            }
            const totalClasses = await ClassModel.countDocuments(filter);
            const getListCurrentClassId = classes.map((item) => item._id);
            const getFieldPopulate = `teacherRegister.idTeacher locationId`
            const listBookTeacher = await BookTeacherModel.find({
                classId: {
                    $in: getListCurrentClassId
                },
            }, {
                teacherRegister: 1,
                classId: 1,
                groupNumber: 1
            }).populate(getFieldPopulate, { fullName: 1, _id: 1, ...forRecruitment ? { locationCode: 1, locationDetail: 1 } : {}, ...fields && getProjection(...fields as Array<string>) });
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
                totalPage: Math.ceil(totalClasses / Number(recordOnPage)),
                currentPage: Number(currentPage) || '',
                recordOnPage: Number(recordOnPage || '')
            }

            resClientData(req, res, 200, dataSend, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const { courseLevelId, courseId, codeClass, dayRange, timeSchedule, bookTeacher, linkZoom, cxo, bu, cxoId, buId } = req.body;
            const findExistClassCode = await ClassModel.findOne({
                codeClass
            });
            if (findExistClassCode) throw new Error('Mã lớp này đã tồn tại!');
            const createdClass = await ClassModel.create({
                courseLevelId,
                courseId,
                codeClass,
                dayRange,
                timeSchedule,
                linkZoom,
                cxo,
                bu,
                cxoId,
                buId
            });
            await BookTeacherModel.insertMany((bookTeacher as Obj[])!.map((item) => {
                return {
                    ...item,
                    classId: createdClass._id
                }
            }))
            resClientData(req, res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    findOneById: async (req: RequestMid, res: Response) => {
        try {
            const { id } = req.params;
            const { fields } = req.query;
            const role = req.acc?.role;
            let listCourseFilter: any[] = [];
            let listClassTcReg: any[] = [];
            let filter: Obj = {
                _id: id
            };
            if (role === ROLE.TEACHER) {
                const record = await TeacherRegisterCourseModel.findOne({
                    idTeacher: req.acc?.userId
                });
                const listCourseRegister = record?.coursesRegister.map(item => item.idCourse) ?? [];
                listCourseFilter = listCourseFilter.concat(listCourseRegister);
                const listClassTeacherRegister = await BookTeacherModel.find({
                    'teacherRegister.idTeacher': req.acc?.userId
                });
                listClassTcReg = listClassTeacherRegister.map((item) => item.classId);
                filter = {
                    _id: id,
                    '$or': [
                        {
                            '$and': [

                                {
                                    _id: {
                                        '$in': listClassTcReg
                                    }
                                }
                            ]
                        },
                        {
                            '$and': [
                                {
                                    status: STATUS_CLASS.PREOPEN
                                },
                                {
                                    courseId: {
                                        '$in': listCourseFilter
                                    }
                                },
                            ]
                        }
                    ]
                }
            }
            const crrClass = await ClassModel.findOne(filter)
                .populate('courseId courseLevelId timeSchedule', { ...fields && getProjection(...fields as Array<string>) });

            if (!crrClass) throw new Error('Không tồn tại lớp!');
            resClientData(req, res, 200, crrClass, 'Tìm thấy!');
        } catch (error: any) {
            resClientData(req, res, 404, undefined, error.message);
        }
    },
    findOneAndUpdate: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { dayRange, codeClass, courseId, courseLevelId, timeSchedule, status, note, linkZoom, bookTeacher, cxo, bu, cxoId, buId, isDelete } = req.body;
            const crrClass = await ClassModel.findById(id).populate('timeSchedule');
            if (!crrClass) throw new Error('Cập nhật thất bại!');
            if (typeof Boolean(isDelete) === 'boolean' && Boolean(isDelete)) {
                crrClass.isDelete = true;
                crrClass.status = STATUS_CLASS.FINISH;
                await crrClass.save();
                resClientData(req, res, 201, {}, 'Thành công!');
                return;
            }
            if (dayRange) crrClass.dayRange = dayRange;
            if (codeClass) crrClass.codeClass = codeClass;
            if (status) crrClass.status = status;
            if (courseId) crrClass.courseId = courseId;
            if (courseLevelId) crrClass.courseLevelId = courseLevelId;
            if (timeSchedule) crrClass.timeSchedule = timeSchedule;
            if (note) crrClass.note = note;
            if (linkZoom) crrClass.linkZoom = linkZoom;
            if (cxo) crrClass.cxo = cxo;
            if (bu) crrClass.bu = bu;
            if (cxoId) crrClass.cxoId = cxoId;
            if (buId) crrClass.buId = buId;
            if (bookTeacher && Array.isArray(bookTeacher) && bookTeacher.length) {
                const listExistedRecord = await BookTeacherModel.find({
                    _id: {
                        '$in': bookTeacher.map(item => item._id)
                    }
                });
                const listUpdate: Promise<any>[] = bookTeacher.map((item) => {
                    const updateData = listExistedRecord.find(upd => upd._id.toString() === item._id) as any;
                    // check existed
                    if (updateData) {
                        for (const key in item) {
                            if ((item as any)[key] !== updateData[key]) {
                                updateData[key] = (item as any)[key];
                            }
                        };
                        return updateData.save();
                    } else {
                        // check unexisted
                        const newRecord = new BookTeacherModel(item);
                        return newRecord.save();
                    }
                });
                await Promise.all(listUpdate);
            }

            if (status === STATUS_CLASS.FINISH) {
                if (status) crrClass.status = status;
                await crrClass.save();
            }
            if (status === STATUS_CLASS.RUNNING) {
                const findExistedClassSessionRecords = await ClassSessionModel.find({
                    classId: crrClass._id
                });
                if (status) crrClass.status = status;
                if (findExistedClassSessionRecords.length !== 0) {
                    await crrClass.save();
                } else {
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
                        if (crrItem.weekday === weekdayOfDayStart) {
                            day.day1 = crrItem
                        }
                        else {
                            day.day2 = crrItem;
                        }
                    }
                    for (let i = 2; i < 16; i++) {
                        listSession[i] = getDateOfWeekday(new Date(listSession[i - 2]), 7);
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
                                _id: new ObjectId(),
                                bookTeacher: record._id
                            }
                            const teacherAccepted = record.teacherRegister.filter((teacher) => {
                                return teacher.accept === true && newSession.locationId?.toString() === record.locationId?.toString()
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
                            genListSessionDocument.push(newSession);
                        });
                    });
                    const recordFb1 = {
                        codeClass: crrClass._id,
                        time: 1,
                        date: listSession[3],
                        done: false,
                        enabled: false,
                        codeClassText: crrClass.codeClass
                    };
                    const recordFb2 = {
                        codeClass: crrClass._id,
                        time: 2,
                        date: listSession[8],
                        done: false,
                        enabled: false,
                        codeClassText: crrClass.codeClass
                    };
                    const getListRecordFb = [recordFb1, recordFb2];
                    const findExistedRecordFB = await FeedbackModel.find({
                        codeClass
                    });
                    if (!findExistedRecordFB.length) {
                        await FeedbackModel.insertMany(getListRecordFb);
                    }
                    const findExistedRecordClassSession = await ClassSessionModel.countDocuments({
                        classId: codeClass
                    });
                    if (!findExistedRecordClassSession) {
                        await ClassSessionModel.insertMany(genListSessionDocument);
                        await TeacherScheduleModel.insertMany(listTeacherAccepted);
                    }
                }
            }
            await crrClass.save();
            resClientData(req, res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
};
export default classController;