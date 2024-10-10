import { Request, Response } from "express";
import FeedbackResponseModel from "../../models/feedbackResponse";
import TeacherPointModel from "../../models/teacherPoint";
import { getProjection, resClientData } from "../../utils";
import { Obj } from "../../global/interface";
import ClassModel from "../../models/class";
import googleSheet from "../../google/googleSheet";
import { getRegion, Region } from "../../global/enum";

const feedbackResponseController = {
    sendResponseFromForm: async (req: Request, res: Response) => {
        try {
            const dataResponse = req.body;
            const insertResponse = await (await FeedbackResponseModel.create(dataResponse)).populate([
                {
                    path: 'codeClass',
                    populate: [
                        {
                            path: 'buId',
                            populate: 'area'
                        },
                        {
                            path: 'cxoId'
                        }
                    ]
                },
                {
                    path: 'course',
                    populate: {
                        path: 'subject'
                    }
                },
                {
                    path: 'groupNumber',
                    populate: [
                        {
                            path: 'locationId'
                        }
                    ]
                }
            ]);
            const createRowSheet = [
                //  thời gian feedfack
                new Date().toLocaleString(),
                // họ tên
                dataResponse.studentName ?? "",
                // email
                dataResponse.phoneNumber ?? "",
                // lần lấy feedback
                (dataResponse.timeCollect ? (dataResponse.timeCollect === 1 ? "Buổi 4" : "Buổi 9") : ''),
                // học phần
                ((insertResponse).course as any)?.subject?.name ?? '',
                // mã lớp
                (insertResponse.codeClass as any)?.codeClass ?? '',
                // miền 
                (insertResponse.codeClass as any)?.buId?.area?.region ? getRegion[(insertResponse.codeClass as any)?.buId?.area?.region as Region] : '',
                // Quản lý lớp
                (insertResponse.codeClass as any)?.cxoId?.name ?? '',
                //  nhóm học tập
                `${(insertResponse.groupNumber as any)?.locationId?.locationCode ? `Nhóm ${(insertResponse.groupNumber as any)?.groupNumber ?? ''} ${(insertResponse.groupNumber as any)?.locationId?.locationCode}` : ''}`,
                // Điểm CS
                dataResponse.pointCxo ?? 0,
                // nhận xét CS
                dataResponse.noteCxo ?? '',
                // Điểm CSVC
                dataResponse.pointOb ?? 0,
                // nhận xét CSVC
                dataResponse.noteOb ?? '',
                // Điểm giảng viên
                dataResponse.pointST ?? 0,
                // nhận xét giảng viên
                dataResponse.noteST ?? '',
                // Điểm mentor
                dataResponse.pointMT ?? 0,
                // nhận xét mentor
                dataResponse.noteMT ?? '',
                // Điểm chương trình đào tạo
                dataResponse.pointSyl ?? 0,
                // nhận xét chương trình đào tạo
                dataResponse.noteSyl ?? '',
                // chia sẻ thêm
                dataResponse.docDetail ?? ''
            ];
            await googleSheet(createRowSheet);
            await TeacherPointModel.create({
                classId: dataResponse.codeClass,
                feedbackResponseId: (insertResponse)._id,
                groupNumber: dataResponse.groupNumber,
                point: dataResponse.teacherPoint,
                teacherId: dataResponse.teacherId,
            });
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    getListRecordResponse: async (req: Request, res: Response) => {
        try {
            // with filter
            /**
             * sortBy:{
             * type: ASC|DESC,
             * field: string
             * }
             */
            const {
                fields,
                currentPage,
                recordOnPage,

                // month,
                // year,
                phoneNumber,
                time,
                course,
                listClass,
                codeClass

            } = req.query;
            let listClassId: string[] = [];
            if (codeClass && !listClass) {
                const listClass = await ClassModel.find({
                    codeClass: {
                        '$regex': codeClass,
                        '$options': 'i'
                    }
                });
                listClassId = listClass.map(item => item._id.toString());
            }
            const filterCondition = {
                ...(listClass || codeClass) ? {
                    codeClass: {
                        '$in': [...(listClass as string[] ?? []), ...listClassId]
                    }
                } : {},
                ...time ? {
                    timeCollect: {
                        '$in': time
                    }
                } : {},
                ...phoneNumber ? {
                    phoneNumber: {
                        '$regex': phoneNumber,
                        '$options': 'i'
                    }
                } : {},
                ...course ? {
                    course: {
                        '$in': course
                    }
                } : {}
            }
            const totalRecord = await FeedbackResponseModel.countDocuments(filterCondition);
            let listResponse: Obj[];
            if (recordOnPage && currentPage) {
                listResponse = await FeedbackResponseModel.find(filterCondition, { ...fields && getProjection(...fields as Array<string>) }).sort({
                    createdAt: -1
                })
                    .skip((Number(recordOnPage) * Number(currentPage)) - Number(recordOnPage)).limit(Number(recordOnPage))
                    .populate('course codeClass groupNumber feedbackId', { ...fields && getProjection(...fields as Array<string>) });
            } else {
                listResponse = await FeedbackResponseModel.find(filterCondition, { ...fields && getProjection(...fields as Array<string>) }).sort({
                    createdAt: -1
                })
                    .populate('course codeClass groupNumber feedbackId', { ...fields && getProjection(...fields as Array<string>) });
            }
            resClientData(req, res, 200, {
                list: listResponse,
                totalPage: Math.ceil(totalRecord / Number(recordOnPage)),
                currentPage: Number(currentPage) || '',
                recordOnPage: Number(recordOnPage || '')
            });
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    getListRecordResponseByTeacherId: async (req: Request, res: Response) => {
        try {
            const { teacherId, currentPage, recordOnPage, fields } = req.query;
            const listResponse = await TeacherPointModel.find({
                teacherId
            }, { ...fields && getProjection(...fields as Array<string>) })
                .sort({
                    createdAt: -1
                })
                .skip((Number(recordOnPage) * Number(currentPage)) - Number(recordOnPage)).limit(Number(recordOnPage))
                .populate('classId feedbackResponseId groupNumber', { ...fields && getProjection(...fields as Array<string>) });
            resClientData(req, res, 200, listResponse);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    }
};
export default feedbackResponseController;