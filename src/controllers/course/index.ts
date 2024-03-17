import { Request, Response } from "express";
import CourseModel from "../../models/course";
import { Obj } from "../../global/interface";
import { getProjectionByString, resClientData } from "../../utils";
import uploadToCloud from "../../utils/cloudinary";
import { RequestMid } from "../../middlewares";
import { ROLE } from "../../global/enum";


const courseController = {
    getAll: async (req: RequestMid, res: Response) => {
        try {
            const { fields } = req.query;
            const getRole = req.acc?.role;
            const notAcceptRole = (!getRole || (getRole && getRole === ROLE.TEACHER));
            let courses: Obj[];
            courses = await CourseModel.find({}, !notAcceptRole ? getProjectionByString(fields as string) : {
                _id: 1,
                color: 1,
                courseName: 1,
                courseTitle: 1,
                courseImage: 1,
                courseLevel: 0
            })
                .populate('courseLevel', getProjectionByString(fields as string))
                .exec().then((rs) => {
                    return rs.map((item) => {
                        const data = item.toObject();
                        data.courseLevel?.sort((a, b) => {
                            return Number((a as unknown as Obj).levelNumber) - Number((b as unknown as Obj).levelNumber)
                        })
                        return data;
                    });
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
            const file = req.file;
            const data: Obj = {
                ...req.body
            };
            if (file) {
                const uploadFile = await uploadToCloud(file);
                data["courseImage"] = uploadFile.secure_url;
            }
            const createCourse = await CourseModel.create(data);
            resClientData(req, res, 200, createCourse, 'Thành công!');
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    updateCourse: async (req: Request, res: Response) => {
        try {
            const file = req.file;
            const data: Obj = {
                ...req.body
            };
            if (file) {
                const uploadFile = await uploadToCloud(file);
                data["courseImage"] = uploadFile.secure_url;
            }
            const { id } = req.params;
            if (req.body.courseLevel) {
                data["courseLevel"] = JSON.parse(req.body.courseLevel)
            }
            await CourseModel.findByIdAndUpdate(id, data);
            resClientData(req, res, 201, {}, 'Cập nhật khoá học thành công!');
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
};
export default courseController;