import { Request, Response } from "express";
import { resClientData } from "../../utils";
import CourseLevelModel from "../../models/courseLevel";
import CourseModel from "../../models/course";

const courseLevelController = {
    create: async (req: Request, res: Response) => {
        try {
            const { courseId, levelName, levelCode, textbook, levelNumber, techRequirements } = req.body;
            const findExistedLevel = await CourseLevelModel.findOne({ levelNumber, courseId });
            if (findExistedLevel) throw new Error(`Level ${levelNumber} đã tồn tại! Vui lòng thay đổi hoặc cập nhật level trước đó!`);
            const createLevel = await CourseLevelModel.create({
                courseId,
                levelName,
                levelCode,
                levelNumber,
                textbook,
                techRequirements
            });

            await CourseModel.findByIdAndUpdate(courseId, {
                $push: {
                    courseLevel: createLevel._id
                }
            });
            resClientData(req, res, 201, createLevel, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    getByCourseId: async (req: Request, res: Response) => {
        try {
            const { courseId } = req.params;
            const listLevel = await CourseLevelModel.find({
                courseId
            }, {
                courseId: 0,
                __v: 0
            });
            resClientData(req, res, 200, listLevel, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
    updateCourseLevel: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { levelName, levelCode, textbook, techRequirements } = req.body;
            const findLevel = await CourseLevelModel.findById(id);
            if (!findLevel) throw new Error('Không tìm thấy!');
            if (levelName) findLevel.levelName = levelName;
            if (levelCode) findLevel.levelCode = levelCode;
            if (textbook) findLevel.textbook = textbook;
            if (techRequirements) findLevel.techRequirements = techRequirements;
            await findLevel.save();
            resClientData(req, res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
};
export default courseLevelController;