import { Request, Response } from "express";
import { encryptPassword, getProjection, mailNotifiFillFormOnboard, resClientData } from "../../utils";
import PreTeacherModel from "../../models/preTeacher";
import TeacherModel from "../../models/teacher";
import TeacherRegisterCourseModel from "../../models/teacherRegisterCourse";
import { ObjectId } from "mongodb";
import AccountModel from "../../models/account";
import { ROLE_TEACHER, RoundProcess, STATUS } from "../../global/enum";
import { RequestMid } from "../../middlewares";
import RecruitmentModel from "../../models/recruiment";
import { Obj } from "../../global/interface";
import uploadToCloud from "../../utils/cloudinary";
import CourseModel from "../../models/course";
import CourseLevelModel from "../../models/courseLevel";
import { labelRole } from "../teacher/config";
import AreaModel from "../../models/area";
import Mailer from "../../utils/mailer";

const preTeacherController = {
    register: async (req: Request, res: Response) => {
        let data: Obj = {};
        data = {
            ...req.body,
            email: String(req.body.email).toLowerCase()
        };
        try {
            const frontId = (req.files as any)?.["frontId"]?.[0] ?? req.body.frontId;
            const backId = (req.files as any)?.["backId"]?.[0] ?? req.body.backId;
            const { isFromSheet } = req.body;
            if (frontId && backId) {

                if (isFromSheet) {

                    const getDataCourseRegister = data.coursesRegister as Obj;
                    const crrCourse = await CourseModel.findOne({
                        courseName: {
                            '$regex': getDataCourseRegister.idCourse,
                            '$options': 'i'
                        }
                    });
                    const levelRegister = await CourseLevelModel.find({
                        courseId: crrCourse?._id,
                        levelNumber: {
                            '$in': (getDataCourseRegister.levelHandle as string[]).map((item) => {
                                return item.split('v')[1]
                            })
                        }
                    });
                    data.role = (data.role as string[])?.map((item => {
                        return (Object.keys(labelRole))?.find((role => labelRole[role as keyof typeof labelRole] === item))
                    }));
                    const crrAea = await AreaModel.findOne({
                        code: {
                            '$regex': String(data.area)?.split('.')[1].trim(),
                            '$options': 'i'
                        }
                    });
                    if (!crrAea) {
                        const defaultArea = await AreaModel.findOne({
                            code: 'Online'
                        });
                        data.area = defaultArea?._id;
                    } else {
                        data.area = crrAea?._id;
                    }
                    (data.coursesRegister as Obj).idCourse = crrCourse?._id;
                    (data.coursesRegister as Obj).levelHandle = levelRegister?.map(item => item._id);
                } else {
                    for (const key in req.body) {
                        data[key] = JSON.parse(req.body[key]);
                    }
                }
                const { email } = data;
                const existedEmail = await PreTeacherModel.findOne({ email });
                if (existedEmail) throw new Error('Đã tồn tại email!');
                const findCandidate = await RecruitmentModel.findOne({
                    email: {
                        '$regex': String(email).trim(),
                        '$options': 'i'
                    }
                });
                if (!findCandidate) throw new Error('Không tìm thấy ứng viên!');
                if (typeof backId !== 'string' && typeof frontId !== 'string') {
                    const uploadFrontId = await uploadToCloud(frontId);
                    const uploadBackId = await uploadToCloud(backId);
                    data["frontId"] = uploadFrontId.secure_url;
                    data["backId"] = uploadBackId.secure_url;
                }
                const register = await PreTeacherModel.create(data);
                findCandidate.fillForm = true;
                findCandidate.roundProcess = RoundProcess.CLAUTID;
                await findCandidate.save();
                const mailer = new Mailer("K18", {
                    to: String(data.email),
                    subject: "[MindX School] Thông báo kết quả điền thông tin - Thành công",
                    html: mailNotifiFillFormOnboard(String(data.fullName), true)
                });
                await mailer.send();
                resClientData(req, res, 201, register, 'Thành công!');
            } else {
                throw new Error("Không có ảnh CCCD!");
            }
        } catch (error: any) {
            const mailer = new Mailer("K18", {
                to: String(data.email),
                subject: "[MindX School] Thông báo kết quả điền thông tin - Thất bại",
                html: mailNotifiFillFormOnboard(String(data.fullName))
            });
            await mailer.send();
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    acceptRequestRegister: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const findRequest = await PreTeacherModel.findById(id);

            if (!findRequest) throw new Error('Không tìm thấy yêu cầu!');
            const { salt, hashedPassword } = encryptPassword(findRequest.email);
            const newAccount = {
                _id: new ObjectId(),
                email: findRequest.email,
                salt,
                password: hashedPassword,
                activate: true
            };

            const findExistedEmail = await AccountModel.findOne({ email: newAccount.email });
            if (findExistedEmail) throw new Error('Email đã tồn tại!');
            const createAccout = await AccountModel.create(newAccount);
            if (createAccout) {
                const mapRole = {
                    roleIsST: false,
                    roleIsMT: false,
                    roleIsSP: false
                };
                (findRequest.role as Array<ROLE_TEACHER>).forEach((item) => {
                    if (item === ROLE_TEACHER.ST) mapRole.roleIsST = true;
                    if (item === ROLE_TEACHER.MT) mapRole.roleIsMT = true;
                    if (item === ROLE_TEACHER.SP) mapRole.roleIsSP = true;
                })
                const newInfoTeacher = {
                    ...findRequest,
                    _id: new ObjectId(),
                    idAccount: newAccount._id,
                    isOffical: true,
                    email: findRequest.email,
                    fullName: findRequest.fullName,
                    phoneNumber: findRequest.phoneNumber,
                    gender: findRequest.gender,
                    dob: findRequest.dob,
                    identify: findRequest.identify,
                    licenseDate: findRequest.licenseDate,
                    licensePlace: findRequest.licensePlace,
                    taxCode: findRequest.taxCode,
                    facebookLink: findRequest.facebookLink,
                    area: findRequest.area,
                    educationInfo: findRequest.educationInfo,
                    companyInfo: findRequest.companyInfo,
                    background: findRequest.background,
                    address: findRequest.address,
                    CVfile: findRequest.CVfile,
                    bankName: findRequest.bankName,
                    bankNumber: findRequest.bankNumber,
                    bankHolderName: findRequest.bankHolderName,
                    ...mapRole,
                    dateStartWork: findRequest.dateStartWork,
                };
                const createTeacherInfo = await TeacherModel.create(newInfoTeacher);
                if (createTeacherInfo) {
                    const newTeacherRegisterCourse = {
                        idTeacher: newInfoTeacher._id,
                        coursesRegister: findRequest.coursesRegister,
                        teacherEmail: newInfoTeacher.email
                    };
                    findRequest.status = STATUS.AT;
                    await findRequest.save();
                    await TeacherRegisterCourseModel.create(newTeacherRegisterCourse);
                }
            }
            resClientData(req, res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    getAll: async (req: RequestMid, res: Response) => {
        try {
            const { fields, recordOnPage, currentPage, email } = req.query;
            const getAll = await PreTeacherModel.find({
                status: 'PENDING',
                ...email ? {
                    email: {
                        "$regex": email,
                        "$options": "i"
                    }
                } : {}
            }, { ...fields && getProjection(...fields as Array<string>) })
                .sort({
                    createdAt: -1
                })
                .skip((Number(recordOnPage) * Number(currentPage)) - Number(recordOnPage)).limit(Number(recordOnPage))
                .populate('coursesRegister.idCourse coursesRegister.levelHandle area', { ...fields && getProjection(...fields as Array<string>) });
            const totalRequest = await PreTeacherModel.countDocuments({});
            const dataRes = {
                list: getAll,
                totalPage: Math.ceil(totalRequest / Number(recordOnPage)),
                currentPage: Number(currentPage) || '',
                recordOnPage: Number(recordOnPage || '')
            }
            resClientData(req, res, 200, dataRes);
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    createNewTeacherRequest: async (req: RequestMid, res: Response) => {
        const { body } = req

        res.json({ "success": body })

    }
};
export default preTeacherController;