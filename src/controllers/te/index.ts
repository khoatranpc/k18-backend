import { Request, Response } from "express";
import TeModel from "../../models/te";
import { resClientData, getProjectionByString, encryptPassword } from "../../utils";
import { RequestMid } from "../../middlewares";
import { Obj } from "../../global/interface";
import uploadToCloud from "../../utils/cloudinary";
import { ROLE } from "../../global/enum";
import AccountModel from "../../models/account";

const teController = {
    getBySingleField: async (req: RequestMid, res: Response) => {
        try {
            const { findBy, value, fields, getAll, condition } = req.query;
            let filter = {};
            if (condition && typeof condition === 'object') {
                filter = {
                    ...condition
                }
            }
            if (Boolean(getAll) === true) {
                const tes = await TeModel.find(filter, getProjectionByString(fields as string)).populate('courseId', getProjectionByString(fields as string));
                resClientData(req, res, 200, tes);
            } else if (findBy) {
                const tes = await TeModel.find({
                    ...findBy === 'courseId' ?
                        {
                            'courseId': value
                        }
                        :
                        {
                            [findBy.toString()]: {
                                '$regex': value,
                                '$options': 'i'
                            }
                        }
                }, getProjectionByString(fields as string)).populate('courseId', getProjectionByString(fields as string));
                resClientData(req, res, 201, tes);
            } else {
                resClientData(req, res, 201, []);
            }
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    createTeInfo: async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const te = await TeModel.create(data);
            resClientData(req, res, 201, te);
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    getById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { fields } = req.query;
            const te = await TeModel.findById(id, getProjectionByString(fields as string))
                .populate("courseId", getProjectionByString(fields as string))
                .populate("accountId", {
                    _id: 1,
                    email: 1,
                    roleAccount: 1,
                });
            if (!te) throw new Error("Không tìm thấy TE!");
            resClientData(req, res, 200, te);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    updateInfo: async (req: Request, res: Response) => {
        try {
            const file = req.file;
            const { id } = req.params;
            const data: Obj = {};
            for (const key in req.body) {
                data[key] = JSON.parse(req.body[key]);
            }
            delete data.accountId;
            if (file) {
                const uploadFile = await uploadToCloud(file);
                data["img"] = uploadFile.secure_url;
            }
            await TeModel.findByIdAndUpdate(id, {
                ...data,
                ...data.courseId ? { courseId: data.courseId ?? [] } : {}
            });
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    createNewTe: async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const { salt, hashedPassword } = encryptPassword(data['email']);
            const newAccount = {
                email: data.email,
                password: hashedPassword,
                role: ROLE.TE,
                activate: true,
                salt
            }
            const findExistedEmail = await AccountModel.findOne({ email: data.email });
            if (findExistedEmail) {
                throw new Error("Email đã tồn tại!");
            }
            const createdAccount = await AccountModel.create(newAccount);
            if (createdAccount) {
                await TeModel.create({
                    accountId: createdAccount._id,
                    ...data
                });
            }
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
}
export default teController;