import { Request, Response } from "express";
import { getDB } from "../../database/config";
import { resClientData } from "../../utils";
import CourseModel from "../../models/course";


const courseController = {
    getAll: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const courses = await CourseModel.find({}).populate('courseLevel');
                resClientData(res, 200, courses, 'Thành công!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message);
                await disconnect();
            }
        })
    },
    getById: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { id } = req.params;
                const course = await CourseModel.findById(id);
                resClientData(res, 200, course, 'Thành công!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 500, undefined, error.message);
                await disconnect();
            }
        })
    },
    createCourse: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { courseName } = req.body;
                const createCourse = await CourseModel.create({
                    courseName
                });
                resClientData(res, 200, createCourse, 'Thành công!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
                await disconnect();
            }
        })
    },
    updateCourse: (req: Request, res: Response) => {
        getDB(async (disconnect) => {
            try {
                const { id } = req.params;
                const { courseName } = req.body;
                await CourseModel.findByIdAndUpdate(id, {
                    courseName
                })
                resClientData(res, 201, {}, 'Thành công!');
                await disconnect();
            } catch (error: any) {
                resClientData(res, 403, undefined, error.message);
                await disconnect();
            }
        })
    },
};
export default courseController;