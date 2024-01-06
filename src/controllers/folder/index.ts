import { Request, Response } from "express";
import { getProjectionByString, resClientData } from "../../utils";
import FolderModel from "../../models/folder";
import FileModel from "../../models/file";
import { ObjectId } from "mongodb";

const folderController = {
    create: async (req: Request, res: Response) => {
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
            const createdFolder = await FolderModel.create(data);
            resClientData(req, res, 201, createdFolder);
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    getAllFolder: async (req: Request, res: Response) => {
        try {
            const { fields, isDeleted } = req.query;
            const listFolder = await FolderModel.find({
                isDeleted: !!Number(isDeleted)
            }, getProjectionByString(fields as string));
            resClientData(req, res, 200, listFolder);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    updateFolder: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (req.body.isDeleted) {
                await FileModel.updateMany({
                    path: {
                        $regex: id,
                    }
                }, {
                    isDeleted: true
                });
                await FolderModel.updateMany({
                    path: {
                        $regex: id,
                    }
                }, {
                    isDeleted: true
                })
            } else {
                await FolderModel.findByIdAndUpdate(id, req.body);
            }
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
};

export default folderController;