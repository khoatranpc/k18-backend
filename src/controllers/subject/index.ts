import { Request, Response } from "express";
import { resClientData } from "../../utils";
import SubjectModel from "../../models/subject";

const subjectController = {
    getListSubject: async (req: Request, res: Response) => {
        try {
            const { isActive, isDeleted } = req.query;
            const subject = await SubjectModel.find({ isActive, isDeleted });
            resClientData(req, res, 200, subject);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    createSubject: async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const subject = await SubjectModel.create(data);
            resClientData(req, res, 201, subject);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
}

export default subjectController;