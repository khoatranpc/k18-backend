import { Request, Response } from "express";
import { Obj } from "../../global/interface";
import AccountModel from "../../models/account";
import { encryptPassword, generateJWT, resClientData, verifyPassword } from "../../utils";
import { RequestMid } from "../../middlewares";
import { getDB } from "../../database/config";

const accountController = {
    login: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { email, password } = req.body;
                const account = await AccountModel.findOne({ email });
                if (!account) throw new Error('Sai tài khoản hoặc mật khẩu!');
                const comparePassword = verifyPassword(password, account as unknown as Obj);
                if (!comparePassword) throw new Error('Sai tài khoản hoặc mật khẩu!');

                if (!account.activate) throw new Error('Bạn không thể đăng nhập, hãy liên hệ với TE để được hỗ trợ!');
                const dataToToken = {
                    accId: account._id,
                    role: account.role
                }
                const token = generateJWT(dataToToken);
                resClientData(res, 202, {
                    id: account._id,
                    ...token
                }, 'Thành công');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
            }
        })
    },
    createForTest: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { email, password } = req.body;
                const readyAccount = await AccountModel.findOne({ email });
                if (readyAccount) throw new Error('Email đã tổn tại!');

                const { salt, hashedPassword } = encryptPassword(password);
                const account = {
                    email,
                    salt,
                    password: hashedPassword
                }
                await AccountModel.create(account);
                resClientData(res, 201, {}, 'Thành công');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message)
            }
        })
    },
    getAllAccount: (req: RequestMid, res: Response) => {
        getDB(async (disconnect) => {
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
                await disconnect();
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
            }
        })
    }
};
export default accountController;