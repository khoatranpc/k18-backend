import { Request, Response } from "express";
import { Obj } from "../../global/interface";
import AccountModel from "../../models/account";
import { encryptPassword, generateJWT, resClientData, verifyPassword } from "../../utils";
import { RequestMid } from "../../middlewares";
import TeacherModel from "../../models/teacher";
import { ROLE } from "../../global/enum";
import TeModel from "../../models/te";

const accountController = {
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const account = await AccountModel.findOne({ email });
            if (!account) throw new Error('Sai tài khoản hoặc mật khẩu!');
            const comparePassword = verifyPassword(password, account as unknown as Obj);
            if (!comparePassword) throw new Error('Sai tài khoản hoặc mật khẩu!');

            if (!account.activate) throw new Error('Bạn không thể đăng nhập, hãy liên hệ với TE để được hỗ trợ!');
            let getPosition;
            switch (account.role) {
                case ROLE.TE:
                    const findTE = await TeModel.findOne({ accountId: account._id });
                    getPosition = findTE?.positionTe;
                    break;
                default:
                    getPosition = undefined;
                    break;
            }
            const dataToToken = {
                accId: account._id,
                role: account.role,
                ...getPosition ? { position: getPosition } : {}
            }
            const token = generateJWT(dataToToken);
            resClientData(res, 202, {
                id: account._id,
                ...token
            }, 'Thành công');
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message);
        }
    },
    createForTest: async (req: Request, res: Response) => {
        try {
            const { email, password, role } = req.body;
            const readyAccount = await AccountModel.findOne({ email });
            if (readyAccount) throw new Error('Email đã tổn tại!');

            const { salt, hashedPassword } = encryptPassword(password);
            const account = {
                email,
                salt,
                password: hashedPassword,
                role
            }
            await AccountModel.create(account);
            resClientData(res, 201, {}, 'Thành công');
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message)
        }
    },
    getAllAccount: async (req: RequestMid, res: Response) => {
        try {
            const crrRole = req.acc;
            const getAcc = await AccountModel.find({
                _id: {
                    $ne: crrRole?.id as string
                }
            }, {
                salt: 0,
                password: 0
            });
            resClientData(res, 200, getAcc, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message);
        }
    },
    getInfo: async (req: RequestMid, res: Response) => {
        try {
            const crrAccount = req.acc;
            let findInfor;
            let getPosition = undefined;
            switch (crrAccount?.role) {
                case ROLE.TE:
                    findInfor = await TeModel.findOne({ accountId: crrAccount?.id }).populate('courseId');
                    getPosition = findInfor?.positionTe;
                    break;
                case ROLE.TEACHER:
                    findInfor = await TeacherModel.findOne({ idAccount: crrAccount?.id });
                    break;
                default:
                    break;
            }
            resClientData(res, 201, {
                roleAccount: crrAccount?.role,
                ...getPosition ? { position: getPosition } : {},
                token: crrAccount?.token,
                ...findInfor ? ((findInfor as unknown as Obj)._doc as Obj) : {}
            }, 'Thành công!');

        } catch (error: any) {
            resClientData(res, 403, undefined, error.message)
        }
    }
};
export default accountController;