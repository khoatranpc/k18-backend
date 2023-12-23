import { Request, Response } from "express";
import { resClientData } from "../../utils";
import uploadToCloud from "../../utils/cloudinary";

const fileController = {
    upload: async (req: Request, res: Response) => {
        try {
            const file = req.file;
            if (!file) throw new Error('Không thể đọc định dạng!');
            const uploaded = await uploadToCloud(file!);
            resClientData(req, res, 201, uploaded);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    }
};
export default fileController;