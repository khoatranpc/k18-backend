import { Request, Response } from "express";
import { resClientData } from "../../utils";
import LocationModel from "../../models/location";

const locationController = {
    get: async (_: Request, res: Response) => {
        try {
            const locations = await LocationModel.find({}).populate('area');
            resClientData(res, 200, locations, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 500, undefined, error.message);
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const { locationDetail, locationCode, locationName, area, active } = req.body;
            await LocationModel.create({
                locationDetail, locationCode, locationName, area, active
            });
            resClientData(res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 500, undefined, error.message);
        }
    },
    findOneAndUpdate: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { locationDetail, locationCode, locationName, area, active } = req.body;
            await LocationModel.findByIdAndUpdate(id, {
                locationDetail, locationCode, locationName, area, active
            });
            resClientData(res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message);
        }
    },
};
export default locationController;
