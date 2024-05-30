import { Request, Response } from "express";
import mongoose from "mongoose";
import { getProjection, getProjectionByString, resClientData } from "../../utils";
import RecruitmentModel from "../../models/recruiment";
import RoundCVModel from "../../models/recruiment/round/cv";
import { RoundProcess } from "../../global/enum";
import RoundClautidModel from "../../models/recruiment/round/clautid";
import FeedbackClautidModel from "../../models/recruiment/feedbackClautid";
import RoundTestModel from "../../models/recruiment/round/test";
import Mailer from "../../utils/mailer";
import RoundInterviewModel from "../../models/recruiment/round/interview";

const recruitmentController = {
    getList: async (req: Request, res: Response) => {
        try {
            const { fields, recordOnPage, currentPage, sort, area, status, resourceHunt, valueSearch, startDate, endDate, courseApply, isGetInfoProcessCandidate } = req.query;
            const totalRecord = await RecruitmentModel.count({
                ...area && area !== 'ALL' ? {
                    area: area
                } : {},
                ...status && status !== 'ALL' ? {
                    statusProcess: status
                } : {},
                ...resourceHunt && resourceHunt !== 'ALL' ? {
                    resourceApply: resourceHunt
                } : {},
            });
            const listCandidate = await RecruitmentModel.find({
                ...valueSearch ? {
                    '$or': [
                        {
                            email: {
                                "$regex": valueSearch,
                                "$options": "i"
                            }
                        },
                        {
                            fullName: {
                                "$regex": valueSearch,
                                "$options": "i"
                            }
                        }
                    ]
                } : {},
                ...area && area !== 'ALL' ? {
                    area: area
                } : {},
                ...status && status !== 'ALL' ? {
                    statusProcess: status
                } : {},
                ...resourceHunt && resourceHunt !== 'ALL' ? {
                    resourceApply: resourceHunt
                } : {},
                ...startDate && endDate ? {
                    createdAt: {
                        '$gte': startDate,
                        '$lte': endDate
                    }
                } : {},
                ...courseApply && courseApply !== 'ALL' ? {
                    courseApply: courseApply
                } : {},
            }, { ...fields && getProjection(...fields as Array<string>) })
                .sort({
                    createdAt: !sort ? -1 : (sort === 'ASC' ? -1 : 1)
                })
                .skip((Number(recordOnPage) * Number(currentPage)) - Number(recordOnPage)).limit(Number(recordOnPage))
                .populate('courseApply', { ...fields && getProjection(...fields as Array<string>) });
            let getInfoProcessCandidate = undefined;

            if (isGetInfoProcessCandidate) {
                const infoCvRound = RoundCVModel.find({
                    candidateId: {
                        $in: listCandidate.map(item => item._id)
                    }
                });
                const infoInterviewRound = RoundInterviewModel.find({
                    candidateId: {
                        $in: listCandidate.map(item => item._id)
                    }
                });
                getInfoProcessCandidate = await Promise.all([infoCvRound, infoInterviewRound]);
            }
            const mapData = listCandidate.map((candidate) => {
                const findRCV = getInfoProcessCandidate?.[0].find(item => item.candidateId.toString() === candidate._id.toString());
                const findRIT = getInfoProcessCandidate?.[1].find(item => item.candidateId.toString() === candidate._id.toString());
                return {
                    ...candidate.toObject(),
                    processCV: findRCV,
                    processInterview: findRIT
                }
            })
            const dataSend = {
                listData: mapData,
                totalPage: Math.ceil(totalRecord / Number(recordOnPage)),
                currentPage: Number(currentPage) || '',
                recordOnPage: Number(recordOnPage || '')
            }
            resClientData(req, res, 200, dataSend);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.messsage);
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const findExistedEmail = await RecruitmentModel.findOne({
                email: data.email
            });
            if (findExistedEmail) throw new Error('Email đã tồn tại');
            const createCandidate = await RecruitmentModel.create({
                ...data
            });
            const created = await RoundCVModel.create({
                candidateId: createCandidate._id
            });
            if (created) {
                const mailer = new Mailer('K18', {
                    to: data.email,
                    subject: data.mail.title,
                    html: data.mail.html
                });
                mailer.send();
            }
            resClientData(req, res, 201, createCandidate);
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    getOneById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { fields } = req.query;
            const getCrrCandidate = await RecruitmentModel.findById(id)
                .populate('courseApply', { ...fields && getProjection(...fields as Array<string>) });
            resClientData(req, res, 200, getCrrCandidate);
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    updateOnCandidateById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;
            await RecruitmentModel.findByIdAndUpdate(id, data);
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    //on board
    getCandidateByEmailForOnboard: async (req: Request, res: Response) => {
        try {
            const { email, fields } = req.query;
            const getCrrCandidate = await RecruitmentModel.findOne({
                email: {
                    "$regex": email,
                    "$options": "i"
                },
                $and: [
                    {
                        roundProcess: {
                            $ne: RoundProcess.CV
                        }
                    },
                    {
                        roundProcess: {
                            $ne: RoundProcess.INTERVIEW
                        }
                    }
                ],
            }, {
                fullName: 1,
                fillForm: 1,
                statusProcess: 1,
                roundProcess: 1,
                email: 1,
                result: 1
            });
            if (!getCrrCandidate) throw new Error('Không tìm thấy dữ liệu ứng viên!');
            resClientData(req, res, 200, getCrrCandidate);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    getRoundClautid: async (req: Request, res: Response) => {
        try {
            const { fields, candidateId } = req.query;
            const getRecordData = await RoundClautidModel.findOne({
                candidateId
            }, getProjectionByString(fields as string))
                .populate("classIdFirst classIdSecond locationFirst locationSecond", getProjectionByString(fields as string));
            resClientData(req, res, 200, getRecordData);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    registerClautid: async (req: Request, res: Response) => {
        try {
            const { emailCandidate, classId, form, location, date } = req.body;
            const getCandidate = await RecruitmentModel.findOne({
                email: emailCandidate
            });
            if (!getCandidate) throw new Error('Không tìm thấy ứng viên!');
            const getRecordClautidData = await RoundClautidModel.findOne({
                candidateId: getCandidate._id
            });
            if (!getRecordClautidData) throw new Error('Ứng viên chưa thể thực hiện dự thính!');
            if (!getRecordClautidData.classIdFirst) {
                getRecordClautidData.classIdFirst = new mongoose.Types.ObjectId(classId as string);
                getRecordClautidData.formFirst = form as string;
                getRecordClautidData.timeFirst = new Date(date as string);
                getRecordClautidData.locationFirst = new mongoose.Types.ObjectId(location as string);
                await getRecordClautidData.save();
            } else if (!getRecordClautidData.classIdSecond) {
                getRecordClautidData.classIdSecond = new mongoose.Types.ObjectId(classId as string);
                getRecordClautidData.formSecond = form as string;
                getRecordClautidData.timeSecond = new Date(date as string);
                getRecordClautidData.locationSecond = new mongoose.Types.ObjectId(location as string);
                await getRecordClautidData.save();
            }
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    createFeedbackClautid: async (req: Request, res: Response) => {
        try {
            const payload = req.body;
            const { countTime } = req.body;
            await FeedbackClautidModel.create(payload);
            if (typeof countTime === 'number') {
                if (!countTime) {
                    await RoundClautidModel.findOneAndUpdate({
                        classIdFirst: payload.class
                    }, {
                        timeFirstDone: true
                    });
                } else {
                    await RoundClautidModel.findOneAndUpdate({
                        classIdSecond: payload.class
                    }, {
                        timeSecondDone: true,
                        result: true
                    });
                    await RecruitmentModel.findByIdAndUpdate(payload.candidateId, {
                        roundProcess: RoundProcess.TEST
                    });
                }
            }
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    getFeedbackClautid: async (req: Request, res: Response) => {
        try {
            // logic for list candidate, list class id
            const { listCandidateId, listClassId, fields } = req.query;
            const data = await FeedbackClautidModel.find({
                candidateId: {
                    $in: String(listCandidateId).split(',')
                },
                class: {
                    $in: String(listClassId).split(',')
                },
            }, getProjectionByString(fields as string));
            resClientData(req, res, 200, data);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    updateClautid: async (req: Request, res: Response) => {
        try {
            const { recordId } = req.params;
            const { classId, location, form, date, countTime } = req.body;

            if (typeof countTime === 'number') {
                await RoundClautidModel.findOneAndUpdate({
                    _id: recordId,
                    ...Number(countTime) === 1 ? {
                        timeFirstDone: false
                    } : {
                        timeSecondDone: false
                    }
                }, ...!Number(countTime) ? [{
                    classIdFirst: classId,
                    timeFirst: date,
                    locationFirst: location,
                    formFirst: form
                }] : [{
                    classIdSecond: classId,
                    timeSecond: date,
                    locationSecond: location,
                    formSecond: form
                }]);
            }
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    getRoundTest: async (req: Request, res: Response) => {
        try {
            const { candidateId } = req.query;
            const findRecord = await RoundTestModel.findOne({
                candidateId
            });
            if (!findRecord) throw new Error('Không tìm thấy bản ghi!');
            resClientData(req, res, 200, findRecord);
        } catch (error: any) {
            resClientData(req, res, 404, null, error.message);
        }
    },
    predictCandidate: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const findCandidate = await RecruitmentModel.findById(id);
            if (!findCandidate) throw new Error("Không tồn tại ứng viên!")
            const queryPredict = await fetch(`${process.env.MC_SERVER as string}/random-forest/${id}?isPredictCandidate=1`);
            const getPredict = await queryPredict.json();
            resClientData(req, res, 200, getPredict);
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    }
}
export default recruitmentController;