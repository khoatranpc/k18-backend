import { Request, Response } from "express";
import { Obj } from "../../global/interface";
import AccountModel from "../../models/account";
import { encryptPassword, formatDateTime, generateJWT, resClientData, verifyPassword } from "../../utils";
import { RequestMid } from "../../middlewares";
import TeacherModel from "../../models/teacher";
import { ROLE } from "../../global/enum";
import TeModel from "../../models/te";
import Mailer from "../../utils/mailer";

const accountController = {
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const account = await AccountModel.findOne({ email });
            if (!account) throw new Error('Sai tài khoản hoặc mật khẩu!');
            const comparePassword = verifyPassword(password, account as unknown as Obj);
            if (!comparePassword) throw new Error('Sai tài khoản hoặc mật khẩu!');
            let userId: string = "";
            if (!account.activate) throw new Error('Bạn không thể đăng nhập, hãy liên hệ với TE để được hỗ trợ!');
            let getPosition;
            switch (account.role) {
                case ROLE.TE:
                    const findTE = await TeModel.findOne({ accountId: account._id });
                    getPosition = findTE?.positionTe;
                    userId = findTE?._id.toString() as string;
                    break;
                default:
                    getPosition = undefined;
                    const findTeacher = await TeacherModel.findOne({ idAccount: account._id });
                    userId = findTeacher?._id.toString() as string;
                    break;
            }
            const dataToToken = {
                accId: account._id,
                role: account.role,
                ...getPosition ? { position: getPosition } : {},
                userId
            }
            const token = generateJWT(dataToToken);
            resClientData(req, res, 202, {
                id: account._id,
                ...token
            }, 'Thành công', true);
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
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
            resClientData(req, res, 201, {}, 'Thành công');
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message)
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
            resClientData(req, res, 200, getAcc, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
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
                    findInfor = await TeacherModel.findOne({ idAccount: crrAccount?.id }).populate('idAccount', { activate: 0, salt: 0, password: 0 });
                    break;
                default:
                    break;
            }
            resClientData(req, res, 201, {
                roleAccount: crrAccount?.role,
                ...getPosition ? { position: getPosition } : {},
                token: crrAccount?.token,
                ...findInfor ? ((findInfor as unknown as Obj)._doc as Obj) : {}
            }, 'Thành công!');

        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message)
        }
    },
    resetPassword: async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const { otp, password, type } = req.body;
            const currentAccount = await AccountModel.findById(id);
            if (!currentAccount) throw new Error('Không tồn tại tài khoản!');
            // for forgot password
            const newPassword = encryptPassword(password);
            if (type && type === 'FORGOT_PASSWORD') {
                if (!otp) throw new Error('Bạn chưa gửi OTP!')
                if (!password) throw new Error('Bạn chưa gửi mật khẩu mới!')
                const currentTime = new Date().getTime();
                const expiresInOtp = currentAccount.expiresInOtp?.getTime();
                if (!expiresInOtp) throw new Error('Không thể thay đổi mật khẩu!');
                if (currentTime <= expiresInOtp) {
                    const otpEncrypt = encryptPassword(otp as string, currentAccount.salt);
                    const checkOtp = (otpEncrypt.hashedPassword === currentAccount.otp);
                    if (!checkOtp) throw new Error('OTP không hợp lệ!');
                    currentAccount.salt = newPassword.salt;
                    currentAccount.password = newPassword.hashedPassword;
                    currentAccount.otp = '';
                    currentAccount.expiresInOtp = undefined
                    await currentAccount.save();
                    resClientData(req, res, 201, {}, 'Cập nhật mật khẩu thành công!', true)
                } else {
                    throw new Error('Hết hạn thay đổi mật khẩu!');
                }
            } else {
                currentAccount.salt = newPassword.salt;
                currentAccount.password = newPassword.hashedPassword;
                await currentAccount.save();
                resClientData(req, res, 201, {}, 'Cập nhật mật khẩu thành công!', true)
            }
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message)
        }
    },
    sendOtp: async (req: Request, res: Response) => {
        try {
            const { email } = req.query;
            const currentAccount = await AccountModel.findOne({
                email
            });
            if (!currentAccount) throw new Error('Không tồn tại tài khoản!');
            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            // Chuyển số thành chuỗi
            const randomString = randomNumber.toString();
            // mã hoá otp
            const encryptOtp = encryptPassword(randomString, currentAccount.salt);
            currentAccount.otp = encryptOtp.hashedPassword;
            const currentTime = new Date();
            const expiresIn = new Date(currentTime.getTime() + 3 * 60 * 1000);
            currentAccount.expiresInOtp = expiresIn;
            await currentAccount.save();
            const titleMail = '[MindX TMS] Reset password';
            const html = `<div>
                <h2>Xin chào <u>${email}</u></h2>
                <p>Bạn đã có một yêu cầu thay đổi mật khẩu vào lúc ${formatDateTime(currentTime)}. Truy cập theo đường dẫn phía dưới để thực hiện thay đổi mật khẩu:</p>
                <p>${process.env.ENV === 'DEV' ? process.env.CLIENT_DOMAIN : process.env.CLIENT_DOMAIN_HOST}/auth/reset-password?id=${currentAccount._id}&otp=${randomString}</p>
                <p>Bạn có 3 phút kể từ lúc nhận email này để đổi mật khẩu.</p>
                <p>Hãy liên hệ với quản lý nếu bạn có bất kỳ câu hỏi gì.</p>
                <p>Trân trọng,</p>
                <p><b>Teaching Manager Team</b></p>
            </div>`;
            const mailer = new Mailer('K18', {
                to: email as string,
                subject: titleMail,
                html
            });
            mailer.send().then(async (rs) => {
                resClientData(req, res, 200, {}, `Yêu cầu thay đổi mật khẩu đã được gửi về mail: ${email}`);
            }).catch((err) => {
                resClientData(req, res, 500, null, err);
            });
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message)
        }
    }
};
export default accountController;