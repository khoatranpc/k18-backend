import { Request, Response } from "express";
import { resClientData } from "../../utils";

const areaController = {
    get: (req: Request, res: Response) => {
        try {
            
        } catch (error: any) {
            resClientData(res, 500, error.message);
        }
    }
}
export default areaController;