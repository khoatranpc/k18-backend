import { Request, Response } from "express";
import { resClientData } from "../../utils";
import DocumentModel from "../../models/documents";

const documentController = {
    createDoc: async (req: Request, res: Response) => {
        try {
            const createdDoc = await DocumentModel.create(req.body);
            resClientData(req, res, 201, createdDoc);
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    getDoc: async (req: Request, res: Response) => {
        try {
            const listDoc = await DocumentModel.find({});
            resClientData(req, res, 200, listDoc);
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