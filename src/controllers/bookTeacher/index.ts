import { Request, Response } from "express";
import BookTeacherModel from "../../models/bookTeacher";
import TeacherModel from "../../models/teacher";
import ClassModel from "../../models/class";
import { ROLE, ROLE_TEACHER, STATUS_CLASS } from "../../global/enum";
import { RequestMid } from "../../middlewares";
import { getProjection, resClientData } from "../../utils";
import { getDB } from "../../database/config";

const bookTeacherController = {
    create: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { listRequest } = req.body;
                const createBookTeacherRequest = await BookTeacherModel.insertMany(listRequest);
                resClientData(res, 201, createBookTeacherRequest, 'Thành công!');
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
            }
            await disconnect();
        })
    },
    getByClassId: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { classId } = req.params;
                const { fields } = req.query;
                const crrBookTeacherRequest = await BookTeacherModel.find({
                    classId
                }, { ...fields && getProjection(...fields as Array<string>) }).populate("locationId teacherRegister.idTeacher", { ...fields && getProjection(...fields as Array<string>) });
                if (!crrBookTeacherRequest) throw new Error('Không tìm thấy yêu cầu!');
                resClientData(res, 200, crrBookTeacherRequest, 'Thành công!');
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message);
            }
            await disconnect();
        })
    },
    handleTeacherRegisterLocaltionForClass: (req: RequestMid, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { idRequest } = req.params;
                const { options, role, idTeacher } = req.query;

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
                                    accept: false
                                });
                                await crrRequest.save();
                                resClientData(res, 201, {});
                            }
                            break;
                        case 'CANCEL':
                            if (findExistedRegister >= 0) {
                                crrRequest.teacherRegister.splice(findExistedRegister, 1);
                                await crrRequest.save();
                                resClientData(res, 201, {});
                            } else throw new Error('Bạn chưa đăng ký!');
                            break;
                        default:
                            resClientData(res, 500, undefined, 'options hợp lệ là REGISTER hoặc CANCEL');
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
                                    accept: true
                                });
                                await crrRequest.save();
                                resClientData(res, 201, {});
                            }
                            break;
                        case 'REMOVE':
                            if (findExistedRegister >= 0) {
                                crrRequest.teacherRegister.splice(findExistedRegister, 1);
                                await crrRequest.save();
                                resClientData(res, 201, {});
                            } else throw new Error('Giáo viên này chưa đăng ký!');
                            break;
                        default:
                            resClientData(res, 500, undefined, 'options truyền chỉ hợp lệ ADD hoặc REMOVE');
                            break;
                    }
                } else throw new Error('Bạn không thể thực hiện yêu cầu!');
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message);
            }
            await disconnect();
        })
    },
};

export default bookTeacherController;