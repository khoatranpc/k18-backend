import { Request, Response } from "express";
import { resClientData } from "../../utils";
import LocationModel from "../../models/location";

const locationController = {
    get: async (_: Request, res: Response) => {
        try {
            const locations = await LocationModel.find({});
            resClientData(res, 200, locations, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 500, undefined, error.message);
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const { locationDetail, locationCode } = req.body;
            await LocationModel.create({
                locationDetail, locationCode
            });
            resClientData(res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 500, undefined, error.message);
        }
    },
    findOneAndUpdate: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { locationDetail, locationCode } = req.body;
            const locations = await LocationModel.findByIdAndUpdate(id, {
                locationDetail, locationCode
            });
            if (!locations) throw new Error('Thất bại!');
            resClientData(res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message);
        }
    },
};
export default locationController;
