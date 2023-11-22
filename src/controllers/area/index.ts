import { Request, Response } from "express";
import { resClientData } from "../../utils";
import AreaModel from "../../models/area";

const areaController = {
    get: async (req: Request, res: Response) => {
        try {
            const listArea = await AreaModel.find();
            resClientData(res, 200, listArea);
        } catch (error: any) {
            resClientData(res, 500, error.message);
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const { code, name } = req.body;
            const existedCode = await AreaModel.findOne({ code });
            if (existedCode) throw new Error('Đã tồn tại mã khu vực!');
            await AreaModel.create({ code, name });
            resClientData(res, 200, {});
        } catch (error: any) {
            resClientData(res, 403, error.message);
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { code, name } = req.body;
            await AreaModel.findByIdAndUpdate(id, {
                code, name
            })
            resClientData(res, 200, {});
        } catch (error: any) {
            resClientData(res, 500, error.message);
        }
    },
}
export default areaController;