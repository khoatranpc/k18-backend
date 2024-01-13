import { Router } from "express";
import collectionQuizController from "../controllers/collectionquiz";

const CollectionQuizRouter = Router();
CollectionQuizRouter.get('', collectionQuizController.getListCollectionQuiz);
CollectionQuizRouter.post('', collectionQuizController.createCollectionQuiz);


export default CollectionQuizRouter;