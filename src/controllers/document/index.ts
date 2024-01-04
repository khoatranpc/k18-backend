import { Request, Response } from "express";
import { getProjectionByString, resClientData } from "../../utils";
import DocumentModel from "../../models/documents";
import { RequestMid } from "../../middlewares";
import { ROLE } from "../../global/enum";

const documentController = {
    createDoc: async (req: Request, res: Response) => {
        try {
            const createdDoc = await DocumentModel.create(req.body);
            resClientData(req, res, 201, createdDoc);
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    getDoc: async (req: RequestMid, res: Response) => {
        try {
            const { fields } = req.query;
            const crrRole = req.acc!.role;
            const listDoc = await DocumentModel.find({
                ...crrRole === ROLE.TE ? {} : {
                    role: crrRole,
                    active: true
                }
            }, getProjectionByString(fields as string));
            resClientData(req, res, 200, listDoc);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    getDocById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const doc = await DocumentModel.findById(id);
            resClientData(req, res, 200, doc);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    updateDocById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await DocumentModel.findByIdAndUpdate(id, req.body);
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    deleteDoc: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await DocumentModel.findByIdAndDelete(id, req.body);
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
}
export default documentController;