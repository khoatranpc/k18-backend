import { Request, Response } from "express";
import { getDB } from "../../database/config";
import { resClientData } from "../../utils";
import LocationModel from "../../models/location";

const locationController = {
    get: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const locations = await LocationModel.find({});
                resClientData(res, 200, locations, 'Thành công!');
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message);
            }
            await disconnect();
        })
    },
    create: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { locationDetail, locationCode } = req.body;
                await LocationModel.create({
                    locationDetail, locationCode
                });
                resClientData(res, 201, {}, 'Thành công!');
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message);
            }
            await disconnect();
        })
    },
    findOneAndUpdate: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
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
            await disconnect();
        })
    },
};
export default locationController;
