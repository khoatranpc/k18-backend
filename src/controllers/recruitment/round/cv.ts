import { Request, Response } from "express";
import { resClientData } from "../../../utils";
import RoundCVModel from "../../../models/recruiment/round/cv";
import { RoundProcess } from "../../../global/enum";
import RoundInterviewModel from "../../../models/recruiment/round/interview";
import RoundClautidModel from "../../../models/recruiment/round/clautid";
import RoundTestModel from "../../../models/recruiment/round/test";

const roundCVController = {
    create: async (req: Request, res: Response) => {
        try {
            const { candidateId } = req.body;
            const createdRoundCv = await RoundCVModel.create({
                candidateId
            });
            resClientData(res, 201, createdRoundCv);
        } catch (error: any) {
            resClientData(res, 403, null, error.message);
        }
    },
    findByIdAndUpdate: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { result } = req.body;
            await RoundCVModel.findByIdAndUpdate(id, {
                result
            });
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
export default roundCVController;