import { Request, Response } from "express";
import CourseModel from "../../models/course";
import { Obj } from "../../global/interface";
import { resClientData } from "../../utils";


const courseController = {
    getAll: async (_: Request, res: Response) => {
        try {
            const courses = await CourseModel.find({}).populate('courseLevel')
                .exec().then((rs) => {
                    return rs.map((item) => {
                        const data = item.toObject();
                        data.courseLevel.sort((a, b) => {
                            return Number((a as unknown as Obj).levelNumber) - Number((b as unknown as Obj).levelNumber)
                        })
                        return data;
                    })
                });
            resClientData(res, 200, courses, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 500, undefined, error.message);
        }
    },
    getById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const course = await CourseModel.findById(id);
            resClientData(res, 200, course, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 500, undefined, error.message);
        }
    },
    createCourse: async (req: Request, res: Response) => {
        try {
            const { courseName } = req.body;
            const createCourse = await CourseModel.create({
                courseName
            });
            resClientData(res, 200, createCourse, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message);
        }
    },
    updateCourse: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { courseName } = req.body;
            await CourseModel.findByIdAndUpdate(id, {
                courseName
            })
            resClientData(res, 201, {}, 'Thành công!');
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message);
        }
    },
};
export default courseController;