import { Request, Response } from "express";
import { resClientData } from "../../utils";
import Mailer from "../../utils/mailer";
import { RoundProcess, StatusProcessing, TemplateMail } from "../../global/enum";
import RoundCVModel from "../../models/recruiment/round/cv";
import RecruitmentModel from "../../models/recruiment";
import RoundInterviewModel from "../../models/recruiment/round/interview";
import MailTemplateModel from "../../models/mailTemplate";

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
                resClientData(req, res, 200, rs);
            }).catch((err) => {
                resClientData(req, res, 500, null, err);
            });

        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    },
    sendMailCandidate: async (req: Request, res: Response) => {
        try {
            const { templateMail, courseName, candidateName, candidateEmail, te } = req.body;
            const crrCandidate = await RecruitmentModel.findOne({
                email: {
                    '$regex': candidateEmail,
                    '$options': 'i',
                }
            });
            if (!crrCandidate) throw new Error('Không tìm thấy ứng viên!');
            const crrTemplateMail = await MailTemplateModel.findOne({
                template: templateMail
            });
            if (!crrTemplateMail) throw new Error('Không tìm thấy mẫu mail!');
            switch (templateMail) {
                case TemplateMail.NOCONNECT:
                    const splitHtml = String(crrTemplateMail.html).split('{{COURSE}}');
                    const html = splitHtml.join(courseName);
                    const mailer = new Mailer('K18', {
                        to: candidateEmail,
                        subject: crrTemplateMail.title,
                        html
                    });
                    await mailer.send().then(async () => {
                        crrCandidate.sendMailNoConnect = true;
                        crrCandidate.roundProcess = RoundProcess.DONE;
                        crrCandidate.statusProcess = StatusProcessing.DONE;
                        await crrCandidate.save();
                    });
                    break;
                case TemplateMail.PENDING:
                    const splitHtmlPending = String(crrTemplateMail.html).split('{{COURSE}}');
                    const htmlPending = splitHtmlPending.join(courseName);
                    const mailerPending = new Mailer('K18', {
                        to: candidateEmail,
                        subject: crrTemplateMail.title,
                        html: htmlPending
                    });
                    await mailerPending.send().then(async () => {
                        crrCandidate.sendMailPending = true;
                        crrCandidate.roundProcess = RoundProcess.DONE;
                        crrCandidate.statusProcess = StatusProcessing.DONE;
                        await crrCandidate.save();
                    });
                    break;
                default:
                    break;
            }
            resClientData(req, res, 200, {});
        } catch (error: any) {
            resClientData(req, res, 500, null, error.message);
        }
    }
};

export default mailerController;