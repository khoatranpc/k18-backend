import { Request, Response } from "express";
import { resClientData } from "../../../utils";
import RoundCVModel from "../../../models/recruiment/round/cv";
import { RoundProcess, StatusProcessing } from "../../../global/enum";
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
            resClientData(res, 201, {});
        } catch (error: any) {
            resClientData(res, 403, null, error.message);
        }
    },
    findByIdAndUpdate: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { result, linkMeet, time, doc, round, candidateId } = req.body;
            if (result === false || result == 'false') {
                await RecruitmentModel.findByIdAndUpdate(candidateId, {
                    statusProcess: StatusProcessing.DONE
                });
            }
            switch (round) {
                case RoundProcess.CV:
                    await RoundCVModel.findByIdAndUpdate(id, {
                        result
                    });
                    if (result) {
                        await RecruitmentModel.findByIdAndUpdate(candidateId, {
                            statusProcess: StatusProcessing.PROCESSING
                        });
                    }
                    break;
                case RoundProcess.INTERVIEW:
                    await RoundInterviewModel.findByIdAndUpdate(id, {
                        result,
                        linkMeet,
                        time
                    });
                    break;
                case RoundProcess.TEST:
                    await RoundTestModel.findByIdAndUpdate(id, {
                        result,
                        linkMeet,
                        doc
                    });
                    break;
                default:
                    throw new Error('round không hợp lệ!');
            }
            resClientData(res, 201, {});
        } catch (error: any) {
            resClientData(res, 403, null, error.message);
        }
    },
    getRound: async (req: Request, res: Response) => {
        try {
            const { round, listCandidateId } = req.query;
            let data;
            if (!listCandidateId) throw new Error('Bạn cần truyền listCandidateId!');
            switch (round) {
                case RoundProcess.CV:
                    data = await RoundCVModel.find({
                        candidateId: {
                            $in: (listCandidateId as unknown as string).split(',')
                        }
                    })
                    break;
                case RoundProcess.INTERVIEW:
                    data = await RoundInterviewModel.find({
                        candidateId: {
                            $in: (listCandidateId as unknown as string).split(',')
                        }
                    })
                    break;
                case RoundProcess.CLAUTID:
                    data = await RoundClautidModel.find({
                        candidateId: {
                            $in: (listCandidateId as unknown as string).split(',')
                        }
                    })
                    break;
                case RoundProcess.TEST:
                    data = await RoundTestModel.find({
                        candidateId: {
                            $in: (listCandidateId as unknown as string).split(',')
                        }
                    })
                    break;
                default:
                    throw new Error('round query không hợp lệ!');
            }
            resClientData(res, 200, data);
        } catch (error: any) {
            resClientData(res, 500, null, error.message);
        }
    }
};
export default roundController;