import { Request, Response } from "express";
import { encryptPassword, resClientData } from "../../utils";
import CSmodel from "../../models/cs";
import AccountModel from "../../models/account";
import { ROLE } from "../../global/enum";

const csController = {
    createCs: async (req: Request, res: Response) => {
        try {
            const findExistedEmail = await CSmodel.findOne({ email: req.body.email });
            if (findExistedEmail) throw new Error('Email đã tồn tại!');
            const { salt, hashedPassword } = encryptPassword(req.body.password);
            const account = {
                email: req.body.email,
                salt,
                password: hashedPassword,
                role: ROLE.CS
            }
            const createdAccount = await AccountModel.create({
                ...account,
                activate: true
            });
            const createdCs = await CSmodel.create({
                ...req.body,
                accountId: createdAccount._id
            });
            resClientData(req, res, 201, createdCs, "Tạo thông tin thành công!");
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    getAll: async (req: Request, res: Response) => {
        try {
            const listCs = await CSmodel.find({}).populate('area');
            resClientData(req, res, 200, listCs);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    findByIdAndUpdate: async (req: Request, res: Response) => {
        try {
            const { password } = req.body;
            const { id } = req.params;
            if (password) {
                const { salt, hashedPassword } = encryptPassword(req.body.password);
                await AccountModel.findByIdAndUpdate(req.body.accountId, {
                    salt,
                    password: hashedPassword
                });
            }
            await CSmodel.findByIdAndUpdate(id, req.body, {
                new: true
            });
            resClientData(req, res, 201, {}, 'Cập nhật thành công!');
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    }
}

export default csController;