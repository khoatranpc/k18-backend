import mongoose from "mongoose";
import { Collections } from "../../database";
import { TemplateMail } from "../../global/enum";

const mailTemplateSchema = new mongoose.Schema({
    html: {
        type: String,
        required: true
    },
    template: {
        type: String,
        enum: TemplateMail,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const MailTemplateModel = mongoose.model(Collections.MAIL_TEMPLATE, mailTemplateSchema);
export default MailTemplateModel;