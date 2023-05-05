import { Request, Response } from "express";
import { getDB } from "../../database/config";
import { resClientData } from "../../utils";
import PreTeacherModel from "../../models/preTeacher";

const preTeacherController = {
    register: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { email } = req.body;
                const existedEmail = await PreTeacherModel.findOne({ email });
                if (existedEmail) throw new Error('Đã tồn tại email!');
                const register = await PreTeacherModel.create(req.body);
                resClientData(res, 201, register, 'Thành công!');
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
            }
            await disconnect();
        })
    }
};
export default preTeacherController;