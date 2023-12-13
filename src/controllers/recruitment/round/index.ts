import { Request, Response } from "express";
import { getProjectionByString, resClientData } from "../../../utils";
import RoundCVModel from "../../../models/recruiment/round/cv";
import { ResultInterview, RoundProcess, StatusProcessing } from "../../../global/enum";
import RoundInterviewModel from "../../../models/recruiment/round/interview";
import RoundClautidModel from "../../../models/recruiment/round/clautid";
import RoundTestModel from "../../../models/recruiment/round/test";
import RecruitmentModel from "../../../models/recruiment";

const roundController = {
    create: async (req: Request, res: Response) => {
        try {
            const {
                candidateId,
                round,

                // interview, test
                linkMeet,
                time,

                //clautid
                classIdFirst,
                classIdSecond,
                formFirst,
                timeFirst,
                formSecond,
                timeFirstDone,
                timeSecond,
                timeSecondDone,

                //test
                doc
            } = req.body;
            switch (round) {
                case RoundProcess.INTERVIEW:
                    await RoundInterviewModel.create({
                        candidateId,
                        linkMeet,
                        result: false,
                        time
                    });
                    // await RecruitmentModel.findByIdAndUpdate(candidateId, {
                    //     statusProcess: StatusProcessing.PROCESSING
                    // });
                    // await RoundCVModel.findOneAndUpdate({
                    //     candidateId,
                    //     result: true
                    // })
                    break;
                case RoundProcess.CLAUTID:
                    await RoundClautidModel.create({
                        candidateId,
                        result: false,
                        classIdFirst,
                        classIdSecond,
                        formFirst,
                        formSecond,
                        timeFirst,
                        timeFirstDone,
                        timeSecond,
                        timeSecondDone,
                    });
                    break;
                case RoundProcess.TEST:
                    await RoundTestModel.create({
                        candidateId,
                        doc,
                        linkMeet,
                        result: false,
                        time
                    });
                    break;
                default:
                    throw new Error('round query không hợp lệ!');
            }
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    findByIdAndUpdate: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { result, linkMeet, time, doc, round, candidateId, te, mailInterviewSent, mailResultSent } = req.body;
            if (result === false || result == 'false') {
                await RecruitmentModel.findByIdAndUpdate(candidateId, {
                    statusProcess: StatusProcessing.DONE,
                    result: ResultInterview.NOTPASS,
                    failCVDate: new Date()
                });
            }
            const currentDataRecruitment = await RecruitmentModel.findById(candidateId);
            if (!currentDataRecruitment) throw new Error('Không tìm thấy dữ liệu ứng viên!');
            switch (round) {
                case RoundProcess.CV:
                    await RoundCVModel.findByIdAndUpdate(id, {
                        result,
                        processed: true
                    });
                    if (result) {
                        currentDataRecruitment.statusProcess = StatusProcessing.PROCESSING;
                        currentDataRecruitment.roundProcess = RoundProcess.INTERVIEW;
                        await currentDataRecruitment.save();
                        const existedDataInterview = await RoundInterviewModel.findOne({
                            candidateId
                        });
                        if (!existedDataInterview) {
                            await RoundInterviewModel.create({
                                candidateId,
                                linkMeet,
                                time
                            });
                        }
                    }
                    break;
                case RoundProcess.INTERVIEW:
                    await RoundInterviewModel.findByIdAndUpdate(id, {
                        result,
                        linkMeet,
                        time,
                        te,
                        mailResultSent,
                        mailInterviewSent,
                        processed: true
                    });
                    await RecruitmentModel.findByIdAndUpdate(candidateId, {
                        interviewDate: time
                    });
                    if (result) {
                        currentDataRecruitment.statusProcess = StatusProcessing.PROCESSING;
                        currentDataRecruitment.roundProcess = RoundProcess.CLAUTID;
                        await currentDataRecruitment.save();
                        const existedDataClautid = await RoundClautidModel.findOne({
                            candidateId
                        });
                        if (!existedDataClautid) {
                            await RoundClautidModel.create({
                                candidateId
                            });
                        }
                    }
                    break;
                case RoundProcess.CLAUTID:
                    if (result) {
                        const existedDataClautid = await RoundTestModel.findOne({
                            candidateId
                        });
                        if (!existedDataClautid) {
                            await RoundTestModel.create({
                                candidateId,
                                doc,
                                linkMeet,
                                time
                            });
                        }
                    }
                    break;
                case RoundProcess.TEST:
                    await RoundTestModel.findByIdAndUpdate(id, {
                        result,
                        linkMeet,
                        doc,
                        time,
                        te,
                    });
                    if (result) {
                        currentDataRecruitment.statusProcess = StatusProcessing.DONE;
                        currentDataRecruitment.result = ResultInterview.PASS;
                        currentDataRecruitment.roundProcess = RoundProcess.DONE;
                        await currentDataRecruitment.save();
                    }
                    break;
                default:
                    throw new Error('round không hợp lệ!');
            }
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    getRound: async (req: Request, res: Response) => {
        try {
            const { round, listCandidateId, fields, getAll } = req.query;
            let data;
            if (!listCandidateId && !getAll) throw new Error('Bạn cần truyền listCandidateId!');
            switch (round) {
                case RoundProcess.CV:
                    data = await RoundCVModel.find({
                        candidateId: {
                            $in: (listCandidateId as unknown as string).split(',')
                        }
                    })
                    break;
                case RoundProcess.INTERVIEW:
                    const condition = !getAll ? {
                        candidateId: {
                            $in: (listCandidateId as unknown as string).split(',')
                        }
                    } : {};
                    data = await RoundInterviewModel.find(condition, getProjectionByString(fields as string))
                        .populate('te candidateId', getProjectionByString(fields as string))
                        .populate({
                            path: 'candidateId',
                            populate: {
                                path: 'courseApply',
                                select: String(fields).split(',')
                            },
                            select: String(fields).split(',')
                        })
                        .populate({
                            path: 'te',
                            populate: {
                                path: 'courseId',
                                select: String(fields).split(',')
                            },
                            select: String(fields).split(',')
                        })
                        .sort({ time: 1 })
                    break;
                case RoundProcess.CLAUTID:
                    data = await RoundClautidModel.find({
                        candidateId: {
                            $in: (listCandidateId as unknown as string).split(',')
                        }
                    }).populate("classIdFirst classIdSecond locationFirst locationSecond", getProjectionByString(fields as string));
                    break;
                case RoundProcess.TEST:
                    data = await RoundTestModel.find({
                        candidateId: {
                            $in: (listCandidateId as unknown as string).split(',')
                        }
                    }, getProjectionByString(fields as string)).populate('te', getProjectionByString(fields as string))
                        .populate({
                            path: 'te',
                            populate: {
                                path: 'courseId',
                                select: String(fields).split(',')
                            }
                        })
                    break;
                default:
                    throw new Error('round query không hợp lệ!');
            }
            resClientData(req, res, 200, data);
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    }
};
export default roundController;