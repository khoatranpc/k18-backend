import mongoose from "mongoose";
import { Collections } from "../../database";
import { LevelTechnique, ObjectTeach, ROLE_TEACHER, ResourseApply, ResultInterview, StatusProcessing } from "../../global/enum";

const recruimentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    timeApply: {
        type: Date,
        required: true
    },
    courseApply: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.COURSE,
        required: true
    },
    levelTechnique: {
        type: String,
        enum: LevelTechnique,
        required: true
    },
    subject: {
        type: String,
        required: true,
    },
    phoneNumber: String,
    linkFacebook: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dob: Date,
    roleApply: {
        type: String,
        enum: ROLE_TEACHER,
        required: true
    },
    note: String,
    resourseApply: {
        type: String,
        enum: ResourseApply,
        required: true
    },
    linkCv: {
        type: String,
        required: true
    },
    expTimeTech: {
        type: Number,
        required: true
    },
    scoreSoftsSkill: {
        type: Number,
        required: true,
        max: 5
    },
    // chứng chỉ/bằng cấp
    qualifications: String,
    // công nghệ sử dụng
    technique: {
        type: String,
        required: true
    },
    expTimeTeach: {
        type: Number,
        required: true
    },
    objectExpTeach: {
        type: String,
        required: true,
        enum: ObjectTeach
    },
    statusProcess: {
        type: String,
        enum: StatusProcessing,
        required: true
    },
    sendMail: {
        type: Boolean,
        required: true
    },
    dateInterview: Date,
    linkMeet: String,
    result: {
        type: String,
        enum: ResultInterview,
        default: ResultInterview.PENDING
    }
},
    {
        timestamps: true
    });
const RecruitmentModel = mongoose.model(Collections.RECRUITMENT, recruimentSchema);
export default RecruitmentModel;