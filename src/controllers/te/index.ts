import { Request, Response } from "express";
import TeModel from "../../models/te";
import { resClientData, getProjectionByString } from "../../utils";
import { RequestMid } from "../../middlewares";
import { Obj } from "../../global/interface";
import uploadToCloud from "../../utils/cloudinary";

const teController = {
    getBySingleField: async (req: RequestMid, res: Response) => {
        try {
            const { findBy, value, fields, getAll } = req.query;
            if (Boolean(getAll) === true) {
                const tes = await TeModel.find({}, getProjectionByString(fields as string)).populate('courseId', getProjectionByString(fields as string));
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
            const te = await TeModel.findById(id, getProjectionByString(fields as string)).populate("courseId", getProjectionByString(fields as string));
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
            const data: Obj = {
                ...req.body
            };
            if (file) {
                const uploadFile = await uploadToCloud(file);
                data["img"] = uploadFile.secure_url;
            }
            await TeModel.findByIdAndUpdate(id, data);
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
}
export default teController;