import { Router } from "express";
import questionController from "../controllers/question";

const QuestionRouter = Router();
QuestionRouter.post('', questionController.createQuestion);
QuestionRouter.get('', questionController.getQuestionByCollectionId);

export default QuestionRouter;