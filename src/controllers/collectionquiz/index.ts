import { Request, Response } from "express";
import { getProjectionByString, resClientData } from "../../utils";
import CollectionQuizModel from "../../models/collectionquiz";

const collectionQuizController = {
    createCollectionQuiz: async (req: Request, res: Response) => {
        try {
            const createdCollection = await CollectionQuizModel.create(req.body);
            resClientData(req, res, 201, createdCollection);
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    getListCollectionQuiz: async (req: Request, res: Response) => {
        try {
            const { fields, courseId, courseLevelId } = req.query;
            const listCollectionQuiz = await CollectionQuizModel.find({
                courseId,
                ...courseLevelId && { levelId: courseLevelId },
                isDelete: false
            }, getProjectionByString(fields as string));
            resClientData(req, res, 200, listCollectionQuiz);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.mesage);
        }
    },
}
export default collectionQuizController;