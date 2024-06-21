import { Request, Response } from "express";
import mongoose from "mongoose";
import BookTeacherModel from "../../models/bookTeacher";
import TeacherModel from "../../models/teacher";
import ClassModel from "../../models/class";
import { ROLE, ROLE_TEACHER, STATUS_CLASS } from "../../global/enum";
import { RequestMid } from "../../middlewares";
import { getProjection, getProjectionByString, resClientData } from "../../utils";
import ClassSessionModel from "../../models/classSession";
import TeacherScheduleModel from "../../models/teacherSchedule";
import { Obj } from "../../global/interface";

const bookTeacherController = {
    create: async (req: Request, res: Response) => {
        try {
            const { listRequest } = req.body;
            const createBookTeacherRequest = await BookTeacherModel.insertMany(listRequest);
            resClientData(req, res, 201, createBookTeacherRequest, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    getListRecordBookTeacher: async (req: Request, res: Response) => {
        try {
            const { listClassId, fields } = req.query;
            const getList = await BookTeacherModel.find({
                classId: {
                    '$in': listClassId
                }
            }, getProjectionByString(fields as string));
            resClientData(req, res, 201, getList, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
    getByClassId: async (req: Request, res: Response) => {
        try {
            const { classId } = req.params;
            const { fields } = req.query;
            const crrBookTeacherRequest = await BookTeacherModel.find({
                classId
            }, { ...fields && getProjection(...fields as Array<string>) }).populate("locationId teacherRegister.idTeacher", { ...fields && getProjection(...fields as Array<string>) });
            if (!crrBookTeacherRequest) throw new Error('Không tìm thấy yêu cầu!');
            resClientData(req, res, 200, crrBookTeacherRequest, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
    handleTeacherRegisterLocaltionForClass: async (req: RequestMid, res: Response) => {
        try {
            const { idRequest } = req.params;
            const { options, role, idTeacher, updateTeacherId, accept } = req.query;

            const crrRequest = await BookTeacherModel.findById(idRequest);
            if (!crrRequest) throw new Error('Không tồn tại bản yêu cầu!');

            const crrTeacher = await TeacherModel.findOne({
                ...req.acc?.role === ROLE.TEACHER ? {
                    idAccount: req.acc?.id
                } : {
                    _id: idTeacher
                }
            });
            if (!crrTeacher) throw new Error('Không tồn tại giáo viên này!');
            const findExistedRegister = crrRequest.teacherRegister.findIndex(item => {
                return (req.acc?.role === ROLE.TEACHER ?
                    (item.idTeacher?.toString() === crrTeacher?._id.toString()) :
                    (item.idTeacher?.toString() === idTeacher))
            });

            const crrClass = await ClassModel.findById(crrRequest.classId);
            if (!crrClass) throw new Error('Không tồn tại lớp có bản yêu cầu này!');

            if (req.acc?.role === ROLE.TEACHER) {
                if (crrClass.status !== STATUS_CLASS.PREOPEN) throw new Error('Bạn không thể thực hiện yêu cầu!');
                switch (options) {
                    case 'REGISTER':
                        if (findExistedRegister >= 0) {
                            throw new Error('Bạn đã đăng ký!');
                        } else {
                            crrRequest.teacherRegister.push({
                                idTeacher: crrTeacher._id,
                                roleRegister: role ? role as ROLE_TEACHER : ROLE_TEACHER.MT,
                                accept: false,
                                enroll: false
                            });
                            await crrRequest.save();
                            resClientData(req, res, 201, {});
                        }
                        break;
                    case 'CANCEL':
                        if (findExistedRegister >= 0) {
                            crrRequest.teacherRegister.splice(findExistedRegister, 1);
                            await crrRequest.save();
                            resClientData(req, res, 201, {});
                        } else throw new Error('Bạn chưa đăng ký!');
                        break;
                    default:
                        resClientData(req, res, 500, undefined, 'options hợp lệ là REGISTER hoặc CANCEL');
                        break;
                }
            } else if (req.acc?.role === ROLE.TE) {
                switch (options) {
                    case 'ADD':
                        if (findExistedRegister >= 0) {
                            throw new Error('Giáo viên này đã đăng ký!');
                        } else {
                            crrRequest.teacherRegister.push({
                                idTeacher: crrTeacher._id,
                                roleRegister: role ? role as ROLE_TEACHER : ROLE_TEACHER.MT,
                                accept: true,
                                enroll: true
                            });
                            await crrRequest.save();
                            if (crrClass.status === STATUS_CLASS.RUNNING) {
                                const getAllClassSession = await ClassSessionModel.find({
                                    classId: crrClass._id
                                });
                                const getSessionUnChecked = getAllClassSession.filter((item) => {
                                    return !item.ran;
                                });
                                const findExistedTimeSchedule = await TeacherScheduleModel.countDocuments({
                                    classSessionId: {
                                        $in: getSessionUnChecked.map(item => {
                                            return item._id;
                                        })
                                    },
                                    teacherId: crrTeacher._id
                                });
                                if (!findExistedTimeSchedule) {
                                    const listTimeKeeping: Obj[] = [];
                                    getSessionUnChecked.forEach((item) => {
                                        const createTimeKeeping = {
                                            teacherId: crrTeacher._id,
                                            classSessionId: item._id,
                                            role: role ? role as ROLE_TEACHER : ROLE_TEACHER.MT
                                        };
                                        listTimeKeeping.push(createTimeKeeping);
                                    });
                                    await TeacherScheduleModel.insertMany(listTimeKeeping);
                                }
                            }
                            resClientData(req, res, 201, {});
                        }
                        break;
                    case 'UPDATE':
                        if (!updateTeacherId) throw new Error('Chưa có trường updateTeacherId!');
                        if (findExistedRegister >= 0) {
                            crrRequest.teacherRegister[findExistedRegister] = {
                                idTeacher: new mongoose.Types.ObjectId(updateTeacherId?.toString()),
                                accept: accept as unknown as boolean,
                                roleRegister: role ? role as ROLE_TEACHER : ROLE_TEACHER.MT,
                                enroll: true
                            }
                            if (crrClass.status === STATUS_CLASS.RUNNING && Boolean(accept)) {
                                const getAllClassSession = await ClassSessionModel.find({
                                    classId: crrClass._id
                                });
                                const getSessionUnChecked = getAllClassSession.filter((item) => {
                                    return !item.ran;
                                });
                                const findExistedTimeSchedule = await TeacherScheduleModel.countDocuments({
                                    classSessionId: {
                                        $in: getSessionUnChecked.map(item => {
                                            return item._id;
                                        })
                                    },
                                    teacherId: crrTeacher._id
                                });
                                if (!findExistedTimeSchedule) {
                                    const listTimeKeeping: Obj[] = [];
                                    getSessionUnChecked.forEach((item) => {
                                        const createTimeKeeping = {
                                            teacherId: crrTeacher._id,
                                            classSessionId: item._id,
                                            role: role ? role as ROLE_TEACHER : ROLE_TEACHER.MT
                                        };
                                        listTimeKeeping.push(createTimeKeeping);
                                    });
                                    await TeacherScheduleModel.insertMany(listTimeKeeping);
                                }
                            }
                            await crrRequest.save();
                            resClientData(req, res, 201, { recordUpdate: idRequest });
                        } else throw new Error('Giáo viên này chưa đăng ký!');
                        break;
                    case 'REMOVE':
                        if (findExistedRegister >= 0) {
                            crrRequest.teacherRegister.splice(findExistedRegister, 1);
                            await crrRequest.save();
                            resClientData(req, res, 201, {});
                        } else throw new Error('Giáo viên này chưa đăng ký!');
                        break;
                    default:
                        resClientData(req, res, 500, undefined, 'options truyền chỉ hợp lệ ADD hoặc REMOVE hoặc UPDATE');
                        break;
                }
            } else throw new Error('Bạn không thể thực hiện yêu cầu!');
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
    getByTeacherRegister: async (req: Request, res: Response) => {
        try {
            const { teacherId } = req.params;
            const { fields } = req.query;
            const data = await BookTeacherModel.find({
            }, { ...fields && getProjection(...fields as Array<string>) })
                .populate('classId locationId', { ...fields && getProjection(...fields as Array<string>) }).exec().then((value) => {
                    return value.filter((item) => {
                        if (teacherId) {
                            const crrTcRs = item.teacherRegister.find(rc => rc.idTeacher._id.toString() === teacherId);
                            return crrTcRs?.accept;
                        }
                        return false;
                    })
                });
            resClientData(req, res, 200, data.reverse());
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    }
};

export default bookTeacherController;