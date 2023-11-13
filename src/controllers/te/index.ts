import { Request, Response } from "express";
import TeModel from "../../models/te";
import { resClientData, getProjectionByString } from "../../utils";

const teController = {
    getBySingleField: async (req: Request, res: Response) => {
        try {
            const { findBy, value, fields } = req.query;
            if (findBy) {
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
                resClientData(res, 201, tes);
            } else {
                resClientData(res, 201, []);
            }
        } catch (error: any) {
            resClientData(res, 403, null, error.message);
        }
    },
    createTeInfo: async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const te = await TeModel.create(data);
            resClientData(res, 201, te);
        } catch (error: any) {
            resClientData(res, 403, null, error.message);
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