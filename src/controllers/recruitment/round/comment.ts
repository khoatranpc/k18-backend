import { Request, Response } from "express";
import { resClientData } from "../../../utils";
import RoundCommentModel from "../../../models/recruiment/roundComment";

const roundCommentController = {
    getComment: async (req: Request, res: Response) => {
        try {
            const { roundId } = req.query;
            const data = await RoundCommentModel.find({
                roundId,
            });
            resClientData(res, 200, data);
        } catch (error: any) {
            resClientData(res, 403, null, error.message);
        }
    },
    createComment: async (req: Request, res: Response) => {
        try {
            const { roundId, userId, content } = req.body;
            const createdComment = await RoundCommentModel.create({
                roundId,
                userId,
                content
            });
            resClientData(res, 201, createdComment);
        } catch (error: any) {
            resClientData(res, 403, null, error.message);
        }
    }
};
export default roundCommentController;