import { Request, Response } from "express";
import { getProjectionByString, resClientData } from "../../../utils";
import RoundCommentModel from "../../../models/recruiment/roundComment";

const roundCommentController = {
    getComment: async (req: Request, res: Response) => {
        try {
            const { roundId, fields } = req.query;
            const data = await RoundCommentModel.find({
                roundId,
            }).populate('teId', getProjectionByString(fields as string)).sort({
                createdAt: -1
            });
            resClientData(res, 200, data);
        } catch (error: any) {
            resClientData(res, 403, null, error.message);
        }
    },
    createComment: async (req: Request, res: Response) => {
        try {
            const { roundId, teId, content } = req.body;
            const createdComment = await RoundCommentModel.create({
                roundId,
                teId,
                content
            });
            resClientData(res, 201, createdComment);
        } catch (error: any) {
            resClientData(res, 403, null, error.message);
        }
    }
};
export default roundCommentController;