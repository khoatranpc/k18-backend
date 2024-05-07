import { Request, Response } from "express";
import { formatDateTime, getProjectionByString, resClientData } from "../../../utils";
import RoundCVModel from "../../../models/recruiment/round/cv";
import { ResultInterview, RoundProcess, StatusProcessing, TemplateMail } from "../../../global/enum";
import RoundInterviewModel from "../../../models/recruiment/round/interview";
import RoundClautidModel from "../../../models/recruiment/round/clautid";
import RoundTestModel from "../../../models/recruiment/round/test";
import RecruitmentModel from "../../../models/recruiment";
import Google from "../../../google";
import MailTemplateModel from "../../../models/mailTemplate";
import { Obj } from "../../../global/interface";
import TeModel from "../../../models/te";
import { calendar_v3 } from "googleapis";

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
            const { result, linkMeet, time, doc, round, candidateId, te, mailInterviewSent, mailResultSent, isSetInterview } = req.body;
            if (result === false || result == 'false') {
                await RecruitmentModel.findByIdAndUpdate(candidateId, {
                    statusProcess: StatusProcessing.DONE,
                    result: ResultInterview.NOTPASS,
                    failCVDate: new Date(),
                });
            }
            const currentDataRecruitment = await RecruitmentModel.findById(candidateId).populate('courseApply');
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
                                time,
                                processed: true
                            });
                        }
                    }
                    break;
                case RoundProcess.INTERVIEW:
                    // missing logic check existed event google calendar
                    // data round interview
                    const dataInterview = await RoundInterviewModel.findById(id);
                    if (!dataInterview) throw new Error("Chưa có dữ liệu thông tin phỏng vấn!");
                    if (isSetInterview) {
                        // create google calendar
                        const endTime = time ? new Date(time) : new Date();
                        endTime.setMinutes(endTime.getMinutes() + 20);
                        endTime.setSeconds(0);
                        const getMailTemplateInterview = await MailTemplateModel.findOne({ template: TemplateMail.INVITEINTERVIEW });
                        if (!getMailTemplateInterview) throw new Error('Không tồn tại mẫu email!');
                        const mapInfoMail = {
                            NAME: currentDataRecruitment.fullName,
                            EMAIL: currentDataRecruitment.email,
                            POSITION: (currentDataRecruitment.courseApply as unknown as Obj)?.courseName as string ?? '',
                            CVLink: currentDataRecruitment.linkCv,
                            TIME: formatDateTime(new Date(time))
                        };
                        let getContentMail = getMailTemplateInterview?.html;
                        getContentMail = getContentMail.replace("NAME", mapInfoMail['NAME']);
                        getContentMail = getContentMail.replace("POSITION", mapInfoMail['POSITION']);
                        getContentMail = getContentMail.replace("TIME", mapInfoMail['TIME']);
                        getContentMail = getContentMail.replace("LINK", `<a href='${mapInfoMail['CVLink']}'><b>Link</b></a>`);
                        const getTe = await TeModel.findById(te);
                        if (!getTe) throw new Error("Không tìm thấy dữ liệu TE!");
                        let event: any;
                        const config: calendar_v3.Params$Resource$Events$Insert | undefined = {
                            requestBody: {
                                start: {
                                    dateTime: time
                                },
                                end: {
                                    dateTime: endTime.toISOString()
                                },
                                summary: getMailTemplateInterview.title,
                                description: getContentMail,
                                attendees: [
                                    {
                                        email: mapInfoMail.EMAIL
                                    },
                                    {
                                        email: getTe.email
                                    },
                                    {
                                        email: getTe.personalEmail
                                    },
                                ]
                            },
                        }
                        if (dataInterview.eventCalendarId) {
                            const existedEvent = await Google.getEvent(dataInterview.eventCalendarId);
                            if (!existedEvent) {
                                event = await Google.createEvents(config);
                            }
                            else {
                                event = await Google.updateEvent(dataInterview.eventCalendarId, config)
                            }
                        } else {
                            event = await Google.createEvents(config);
                        }
                        dataInterview.result = result;
                        dataInterview.linkMeet = event.hangoutLink as string;
                        dataInterview.time = new Date(event.start?.dateTime as string);
                        dataInterview.te = te;
                        dataInterview.mailResultSent = false;
                        dataInterview.mailInterviewSent = true;
                        dataInterview.processed = false;
                        dataInterview.eventCalendarId = event.id as string;
                        await dataInterview.save();
                        await RecruitmentModel.findByIdAndUpdate(candidateId, {
                            interviewDate: time
                        });
                    }
                    if (result) {
                        currentDataRecruitment.statusProcess = StatusProcessing.PROCESSING;
                        currentDataRecruitment.roundProcess = RoundProcess.CLAUTID;
                        dataInterview.processed = true;
                        dataInterview.result = true;
                        await currentDataRecruitment.save();
                        await dataInterview.save();
                        const existedDataClautid = await RoundClautidModel.findOne({
                            candidateId
                        });
                        if (!existedDataClautid) {
                            await RoundClautidModel.create({
                                candidateId
                            });
                        }
                    } else if (result === false) {
                        dataInterview.processed = true;
                        dataInterview.result = false;
                        await dataInterview.save();
                    }
                    break;
                case RoundProcess.CLAUTID:
                    if (result) {
                        await RoundClautidModel.findOneAndUpdate({
                            candidateId,
                            result
                        });
                        currentDataRecruitment.roundProcess = RoundProcess.TEST
                        const existedDataTest = await RoundTestModel.findOne({
                            candidateId,
                        });
                        await currentDataRecruitment.save();
                        if (!existedDataTest) {
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