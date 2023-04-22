import { Request, Response } from "express";
import { getDB } from "../../database/config";
import { resClientData } from "../../utils";
import CourseLevelModel from "../../models/courseLevel";
import CourseModel from "../../models/course";

const courseLevelController = {
    create: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { courseId, levelName, levelCode, syllabus } = req.body;
                const createLevel = await CourseLevelModel.create({
                    courseId,
                    levelName,
                    levelCode,
                    syllabus
                });
                await CourseModel.findByIdAndUpdate(courseId, {
                    $push: {
                        courseLevel: createLevel._id
                    }
                });
                resClientData(res, 201, createLevel, 'Thành công!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
                await disconnect();
            }
        });
    },
    getByCourseId: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { courseId } = req.params;
                const listLevel = await CourseLevelModel.find({
                    courseId
                }, {
                    courseId: 0,
                    __v: 0
                });
                resClientData(res, 200, listLevel, 'Thành công!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message);
                await disconnect();
            }
        })
    },
    updateCourseLevel: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { id } = req.params;
                const { levelName, levelCode, syllabus } = req.body;
                const findLevel = await CourseLevelModel.findById(id);
                if (!findLevel) throw new Error('Không tìm thấy!');
                if (levelName) findLevel.levelName = levelName;
                if (levelCode) findLevel.levelCode = levelCode;
                if (syllabus) findLevel.syllabus = syllabus;
                await findLevel.save();
                resClientData(res, 201, {}, 'Thành công!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message);
                await disconnect();
            }
        })
    },
};
export default courseLevelController;