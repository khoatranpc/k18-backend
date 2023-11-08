import { Request, Response } from "express";
import { resClientData } from "../../utils";
import MailTemplateModel from "../../models/mailTemplate";

const mailTemplateController = {
    get: async (req: Request, res: Response) => {
        try {
            const { template } = req.query;
            if (template) {
                const templateData = await MailTemplateModel.findOne({
                    template
                });
                if (!templateData) {
                    resClientData(res, 200, {});
                } else {
                    resClientData(res, 200, templateData);
                }
            } else {
                const listTemplate = await MailTemplateModel.find()
                resClientData(res, 200, listTemplate);
            }
        } catch (error: any) {
            resClientData(res, 500, null, error.message);
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const { html, title, template } = req.body;
            const createTemplate = await MailTemplateModel.create({
                template,
                html,
                title
            });
            resClientData(res, 201, createTemplate);
        } catch (error: any) {
            resClientData(res, 500, null, error.message);
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { html, title } = req.body;
            const updateTemplate = await MailTemplateModel.findByIdAndUpdate(id, {
                html,
                title
            });
            resClientData(res, 201, updateTemplate);
        } catch (error: any) {
            resClientData(res, 500, null, error.message);
        }
    },
}
export default mailTemplateController;