import { Request, Response } from "express";
import { encryptPassword, resClientData } from "../../utils";
import CSmodel from "../../models/cs";
import AccountModel from "../../models/account";
import { ROLE } from "../../global/enum";
import uploadToCloud from "../../utils/cloudinary";
import { Obj } from "../../global/interface";

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
            const file = req.file;
            const data: Obj = {
                ...req.body
            };
            if (file) {
                const uploadFile = await uploadToCloud(file);
                data["image"] = uploadFile.secure_url;
            }
            const createdCs = await CSmodel.create({
                ...data,
                accountId: createdAccount._id
            });
            resClientData(req, res, 201, createdCs, "Tạo thông tin thành công!");
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    getAll: async (req: Request, res: Response) => {
        try {
            const listCs = await CSmodel.find(req.query).populate('area');
            resClientData(req, res, 200, listCs);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    findByIdAndUpdate: async (req: Request, res: Response) => {
        try {
            const { password } = req.body;
            const { id } = req.params;
            const file = req.file;
            const data: Obj = {
                ...req.body
            };
            if (file) {
                const uploadFile = await uploadToCloud(file);
                data["image"] = uploadFile.secure_url;
            }
            if (password) {
                const { salt, hashedPassword } = encryptPassword(req.body.password);
                await AccountModel.findByIdAndUpdate(req.body.accountId, {
                    salt,
                    password: hashedPassword
                });
            }
            await CSmodel.findByIdAndUpdate(id, data, {
                new: true
            });
            resClientData(req, res, 201, {}, 'Cập nhật thành công!');
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    }
}

export default csController;