import { Request, Response } from "express";
import TeModel from "../../models/te";
import { resClientData, getProjectionByString } from "../../utils";
import { RequestMid } from "../../middlewares";

const teController = {
    getBySingleField: async (req: RequestMid, res: Response) => {
        try {
            const { findBy, value, fields, getAll } = req.query;
            if (Boolean(getAll) === true) {
                const tes = await TeModel.find({
                    "_id": {
                        "$ne": req.acc?.userId
                    }
                }, getProjectionByString(fields as string)).populate('courseId', getProjectionByString(fields as string));
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
    getByAccountId: (req: Request, res: Response) => {
        try {
            const { } = req.body
        } catch (error: any) {

        }
    }
}
export default teController;