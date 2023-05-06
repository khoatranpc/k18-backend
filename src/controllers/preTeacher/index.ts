import { Request, Response } from "express";
import { getDB } from "../../database/config";
import { encryptPassword, resClientData } from "../../utils";
import PreTeacherModel from "../../models/preTeacher";
import TeacherModel from "../../models/teacher";
import TeacherRegisterCourseModel from "../../models/teacherRegisterCourse";
import { ObjectId } from "mongodb";
import AccountModel from "../../models/account";
import { STATUS } from "../../global/enum";

const preTeacherController = {
    register: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { email } = req.body;
                const existedEmail = await PreTeacherModel.findOne({ email });
                if (existedEmail) throw new Error('Đã tồn tại email!');
                const register = await PreTeacherModel.create(req.body);
                resClientData(res, 201, register, 'Thành công!');
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
            }
            await disconnect();
        })
    },
    acceptRequestRegister: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
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
                        role: findRequest.role,
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
            await disconnect();
        });
    }
};
export default preTeacherController;