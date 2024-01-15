import { Request, Response } from "express";
import { resClientData } from "../../utils";
import StudentModel from "../../models/student";

const studentController = {
    saveInfo: async (req: Request, res: Response) => {
        try {
            const { studentName, email } = req.body;
            const findStudent = await StudentModel.findOne({email});
            
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    }
}

export default studentController;