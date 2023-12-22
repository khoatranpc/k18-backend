import { Request, Response } from "express";
import CourseModel from "../../models/course";
import { Obj } from "../../global/interface";
import { resClientData } from "../../utils";


const courseController = {
    getAll: async (req: Request, res: Response) => {
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
            resClientData(req, res, 200, courses, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
    getById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const course = await CourseModel.findById(id).populate('courseLevel');
            resClientData(req, res, 200, course, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
    createCourse: async (req: Request, res: Response) => {
        try {
            const createCourse = await CourseModel.create(req.body);
            resClientData(req, res, 200, createCourse, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    updateCourse: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await CourseModel.findByIdAndUpdate(id, req.body);
            resClientData(req, res, 201, {}, 'Cập nhật khoá học thành công!');
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
};
export default courseController;