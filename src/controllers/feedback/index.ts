import { Request, Response } from "express";
import { getProjection, resClientData } from "../../utils";
import FeedbackModel from "../../models/feedback";
import { Obj } from "../../global/interface";
import BookTeacherModel from "../../models/bookTeacher";
import { ROLE_TEACHER } from "../../global/enum";
import ClassTeacherPointModel from "../../models/classTeacherPoint";

const feedbackController = {
    getRecordByMonth: async (req: Request, res: Response) => {
        try {
            const { date, fields, codeClassText, time, enabled, done } = req.query;
            const startDate = new Date(Number((date as Obj)?.year as string), Number((date as Obj)?.month as string) - 1, 1);
            const endDate = new Date(Number((date as Obj)?.year as string), Number((date as Obj)?.month as string), 0);
            const getList = await FeedbackModel.find({
                date: {
                    $lte: endDate,
                    $gte: startDate
                },
                enabled: {
                    $in: enabled
                },
                time: {
                    $in: time
                },
                done: JSON.parse(done as string),
                ...codeClassText ? {
                    codeClassText: {
                        '$regex': codeClassText,
                        '$options': 'i'
                    }
                } : {},
            }, { ...fields && getProjection(...fields as Array<string>) }).populate({
                path: 'codeClass',
                select: fields,
                populate: {
                    path: 'courseId'
                }
            });
            resClientData(req, res, 200, getList);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    updateRecord: async (req: Request, res: Response) => {
        try {
            const { feedbackId } = req.params;
            const { enabled, done } = req.body;
            const update = await FeedbackModel.findOneAndUpdate({
                _id: feedbackId
            }, {
                enabled,
                done
            }, {
                new: true
            });
            const recordTcPClass = await ClassTeacherPointModel.findOne({
                feedbackId: feedbackId
            });
            if (!recordTcPClass && update && enabled) {
                await ClassTeacherPointModel.create({
                    classId: update.codeClass,
                    feedbackId: update._id,
                    teacherPoint: 0,
                    timeCollect: update.time,
                });
            }
            resClientData(req, res, 201, update);
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    getClassForStudentFormFeedback: async (req: Request, res: Response) => {
        try {
            const { courseName } = req.query;
            const findClassWithCourseName = await FeedbackModel.find({
                done: false,
                enabled: true
            }).populate({
                path: 'codeClass',
                select: 'codeClass _id',
                populate: {
                    path: 'courseId',
                    select: 'courseName _id'
                },
            }).exec().then((rs) => {
                return rs.filter((item) => {
                    return (item.codeClass as any).courseId.courseName === courseName
                })
            });
            resClientData(req, res, 200, findClassWithCourseName);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    getGroupInClass: async (req: Request, res: Response) => {
        try {
            const { classId } = req.params;
            const recordBookTeacher = await BookTeacherModel.find({
                classId,
            }).populate('locationId teacherRegister.idTeacher', {
                idAccount: 0,
                isOffical: 0,
                email: 0,
                phoneNumber: 0,
                gender: 0,
                dob: 0,
                identify: 0,
                licenseDate: 0,
                licensePlace: 0,
                taxCode: 0,
                facebookLink: 0,
                area: 0,
                educationInfo: 0,
                companyInfo: 0,
                background: 0,
                address: 0,
                CVfile: 0,
                bankName: 0,
                bankNumber: 0,
                bankHolderName: 0,
                roleIsST: 0,
                roleIsMT: 0,
                roleIsSP: 0,
                dateStartWork: 0,
                createdAt: 0,
                updatedAt: 0,
                salaryPH: 0,
                teacherPoint: 0,
                frontId: 0,
                infoAllowance: 0,
                permanentAddress: 0
            }).exec().then((rs) => {
                return rs.filter((item) => {
                    return item.teacherRegister.find((rc) => rc.accept === true && rc.roleRegister !== ROLE_TEACHER.SP);
                })
            });
            resClientData(req, res, 200, recordBookTeacher);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    }
};
export default feedbackController;