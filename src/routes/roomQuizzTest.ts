import { Router } from "express";
import roomQuizzTestController from "../controllers/roomQuizzTest";

const RoomQuizzTestRouter = Router();

RoomQuizzTestRouter.post('', roomQuizzTestController.saveRoom);
RoomQuizzTestRouter.post('/student', roomQuizzTestController.studentJoinRoom);
export default RoomQuizzTestRouter;