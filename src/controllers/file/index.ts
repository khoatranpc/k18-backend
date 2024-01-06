import { Request, Response } from "express";
import { getProjectionByString, resClientData } from "../../utils";
import FileModel from "../../models/file";
import { ObjectId } from "mongodb";

const fileController = {
    getAllFile: async (req: Request, res: Response) => {
        try {
            const { fields, isDeleted } = req.query;
            const listFile = await FileModel.find({
                isDeleted
            }, getProjectionByString(fields as string));
            resClientData(req, res, 200, listFile);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    createFile: async (req: Request, res: Response) => {
        try {
            const { path } = req.body;
            const newId = new ObjectId();
            const data = {
                ...req.body,
                ...path ? {
                    path: `${path}/${newId}`,
                } : {
                    path: `${newId}`
                },
                _id: newId
            }
            const createdFile = await FileModel.create(data);
            resClientData(req, res, 201, createdFile);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    updateFile: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { restore } = req.body;
            const updatedFile = await FileModel.findByIdAndUpdate(id, {
                ...req.body,
                ...restore && {
                    isDeleted: false
                }
            });
            resClientData(req, res, 201, updatedFile);
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    deleteFile: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await FileModel.findByIdAndDelete(id);
            resClientData(req, res, 201, {});
        }
        catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    }
};
export default fileController;