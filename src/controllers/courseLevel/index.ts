import { Request, Response } from "express";
import { resClientData } from "../../utils";
import CourseLevelModel from "../../models/courseLevel";
import CourseModel from "../../models/course";
import { Obj } from "../../global/interface";
import uploadToCloud from "../../utils/cloudinary";

const courseLevelController = {
    create: async (req: Request, res: Response) => {
        try {
            const { courseId, levelName, levelCode, textbook, levelNumber, techRequirements, record, levelDescription, levelImage } = req.body;
            const findExistedLevel = await CourseLevelModel.findOne({ levelNumber, courseId });
            if (findExistedLevel) throw new Error(`Level ${levelNumber} đã tồn tại! Vui lòng thay đổi hoặc cập nhật level trước đó!`);
            const createLevel = await CourseLevelModel.create({
                courseId,
                levelName,
                levelCode,
                levelNumber,
                textbook,
                techRequirements,
                record,
                levelDescription,
                levelImage,
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
            const file = req.file;
            const data: Obj = {
                ...req.body
            };
            if (file) {
                const uploadFile = await uploadToCloud(file);
                data["levelImage"] = uploadFile.secure_url;
            }
            if (req.body.techRequirements) {
                data["techRequirements"] = JSON.parse(req.body.techRequirements)
            }
            const findLevel = await CourseLevelModel.findByIdAndUpdate(id, data);
            if (!findLevel) throw new Error('Không tìm thấy!');
            resClientData(req, res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
};
export default courseLevelController;