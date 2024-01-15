import { Request, Response } from "express";
import { resClientData } from "../../utils";
import RoomQuizzTestModel from "../../models/roomQuizzTest";
import StudentModel from "../../models/student";

const roomQuizzTestController = {
    saveRoom: async (req: Request, res: Response) => {
        try {
            const { codeClass, active, questionId } = req.body;
            const findRoom = await RoomQuizzTestModel.findOne({
                questionId,
                codeClass
            });
            if (!findRoom) {
                const newRoom = new RoomQuizzTestModel({
                    codeClass, questionId
                });
                await newRoom.save();
            } else {
                findRoom.active = active;
                await findRoom.save();
            }
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    studentJoinRoom: async (req: Request, res: Response) => {
        try {
            const { studentName, email, room } = req.body;
            const findStudent = await StudentModel.findOne({ email });
            if (findStudent) {
                findStudent.studentName = studentName;
                await findStudent.save();
            } else {
                const newStudent = new StudentModel(req.body);
                await newStudent.save();
            }
            const crrRoom = await RoomQuizzTestModel.findOne({
                codeClass: room,
                active: true
            });
            if (!crrRoom) throw new Error('Phiên kiểm tra không tồn tại hoặc đã kết thúc!');
            resClientData(req, res, 200, {});
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    }
}
export default roomQuizzTestController;