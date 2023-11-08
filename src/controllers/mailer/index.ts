import { Request, Response } from "express";
import { resClientData } from "../../utils";
import Mailer from "../../utils/mailer";
import { RoundProcess } from "../../global/enum";
import RoundCVModel from "../../models/recruiment/round/cv";
import RecruitmentModel from "../../models/recruiment";
import RoundInterviewModel from "../../models/recruiment/round/interview";

const mailerController = {
    sendMail: (req: Request, res: Response) => {
        try {
            const { from, toMail, subject, text, html, candidateId, round, isNotiScheduleInterview } = req.body
            const mailer = new Mailer(from as 'K12' | 'K18', {
                to: toMail,
                subject,
                text,
                html
            });
            mailer.send().then(async (rs) => {
                switch (round) {
                    case RoundProcess.CV:
                        await RoundCVModel.findOneAndUpdate({
                            candidateId
                        }, {
                            sentMail: true
                        });
                        await RecruitmentModel.findByIdAndUpdate(candidateId, {
                            sendMail: true
                        });
                        break;
                    case RoundProcess.INTERVIEW:
                        // pending logic sent isNotiScheduleInterview
                        await RoundInterviewModel.findOneAndUpdate({
                            candidateId
                        }, {
                            mailResultSent: true
                        });
                        break;
                    default:
                        break;
                }
                resClientData(res, 200, rs);
            }).catch((err) => {
                resClientData(res, 500, null, err);
            });

        } catch (error: any) {
            console.log(error);
            resClientData(res, 500, null, error.message);
        }
    }
};

export default mailerController;