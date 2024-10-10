import { Request, Response } from "express";
import googleSheet from "../../google/googleSheet";
import { resClientData } from "../../utils";

const googleSheetController = {
    writeToSheet: async (req: Request, res: Response) => {
        await googleSheet(['', '']);
        resClientData(req, res, 200, {});
    }
};

export default googleSheetController;