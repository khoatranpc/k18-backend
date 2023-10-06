import { Request, Response } from "express";
import TeModel from "../../models/te";
import { resClientData } from "../../utils";

const teController = {
    getAll: (req: Request, res: Response) => {

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