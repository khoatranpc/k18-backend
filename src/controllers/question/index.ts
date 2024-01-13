import { Request, Response } from "express";
import QuestionModel from "../../models/question";
import { TypeQuestion } from "../../global/enum";
import { Obj } from "../../global/interface";
import { resClientData } from "../../utils";
import { createListQuestionAndOption } from "./config";
import OptionModel from "../../models/question/option";

const questionController = {
    createQuestion: async (req: Request, res: Response) => {
        try {
            const { listQuestion } = req.body;
            const createListQuestion = createListQuestionAndOption(listQuestion as Obj[]);
            const asyncListQuestion = createListQuestion.questions.map(async (item) => {
                const existedQuestion = await QuestionModel.findById(item._id);
                if (existedQuestion) {
                    existedQuestion.title = item.title as string;
                    existedQuestion.type = item.type as TypeQuestion;
                    return existedQuestion.save();
                } else {
                    const newQuestion = new QuestionModel(item);
                    return newQuestion.save();
                }
            });
            const asyncListOption = createListQuestion.options.map(async (item) => {
                const existedOption = await OptionModel.findById(item._id);
                if (existedOption) {
                    existedOption.content = item.content as string;
                    existedOption.isCorrect = item.isCorrect as boolean;
                    return existedOption.save();
                } else {
                    const newOption = new OptionModel(item);
                    return newOption.save();
                }
            });
            await Promise.all([...asyncListQuestion, ...asyncListOption]);
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    getQuestionByCollectionId: async (req: Request, res: Response) => {
        try {
            const { collectionQuizId } = req.query;
            const listQuestion = await QuestionModel.find({
                collectionQuizId: collectionQuizId,
                isDelete: false
            });
            const listOption = await OptionModel.find({
                questionId: {
                    $in: listQuestion.map(item => item._id)
                },
                isDelete: false
            });
            resClientData(req, res, 200, { listQuestion, listOption });
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    }
}

export default questionController;