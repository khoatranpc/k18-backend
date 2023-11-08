import { Request, Response } from "express";
import { encryptPassword, getProjection, resClientData } from "../../utils";
import PreTeacherModel from "../../models/preTeacher";
import TeacherModel from "../../models/teacher";
import TeacherRegisterCourseModel from "../../models/teacherRegisterCourse";
import { ObjectId } from "mongodb";
import AccountModel from "../../models/account";
import { ROLE_TEACHER, STATUS } from "../../global/enum";
import { RequestMid } from "../../middlewares";
import RecruitmentModel from "../../models/recruiment";

const preTeacherController = {
    register: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const existedEmail = await PreTeacherModel.findOne({ email });
            if (existedEmail) throw new Error('Đã tồn tại email!');
            const findCandidate = await RecruitmentModel.findOne({
                email
            });
            if (!findCandidate) throw new Error('Không tìm thấy ứng viên!');
            const register = await PreTeacherModel.create(req.body);
            findCandidate.fillForm = true;
            await findCandidate.save();
            resClientData(res, 201, register, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message);
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
                        coursesRegister: findRequest.coursesRegister
                    };
                    findRequest.status = STATUS.AT;
                    await findRequest.save();
                    await TeacherRegisterCourseModel.create(newTeacherRegisterCourse);
                }
            }
            resClientData(res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message);
        }
    },
    getAll: async (req: RequestMid, res: Response) => {
        try {
            const { fields, recordOnPage, currentPage } = req.query;
            const getAll = await PreTeacherModel.find({
                status: 'PENDING'
            }, { ...fields && getProjection(...fields as Array<string>) })
                .sort({
                    createdAt: -1
                })
                .skip((Number(recordOnPage) * Number(currentPage)) - Number(recordOnPage)).limit(Number(recordOnPage))
                .populate('coursesRegister.idCourse coursesRegister.levelHandle', { ...fields && getProjection(...fields as Array<string>) });
            const totalRequest = await PreTeacherModel.countDocuments({});
            const dataRes = {
                list: getAll,
                totalPage: Math.ceil(totalRequest / Number(recordOnPage)),
                currentPage: Number(currentPage) || '',
                recordOnPage: Number(recordOnPage || '')
            }
            resClientData(res, 200, dataRes);
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message);
        }
    }
};
export default preTeacherController;