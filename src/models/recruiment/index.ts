import mongoose from "mongoose";
import { Collections } from "../../database";
import { Education, LevelTechnique, ObjectTeach, ROLE_TEACHER, ResourseApply, ResultInterview, RoundProcess, StatusProcessing } from "../../global/enum";

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
    jobPosition: {
        type: String,
        required: true
    },
    scoreSoftsSkill: {
        type: Number,
        required: true,
        max: 5
    },
    // đã tốt nghiệp đại học
    graduatedUniversity: {
        type: Boolean,
        required: true
    },
    // học vấn? thạc sĩ, tiến sĩ, nghiên cứu sinh, kỹ sư
    education: {
        type: String,
        required: true,
        enum: Education,
    },
    // chuyên ngành it
    specializedIt: {
        type: Boolean,
        required: true
    },
    // công nghệ sử dụng
    technique: {
        type: String,
        required: true
    },
    teacherCertification: {
        type: Boolean,
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
    result: {
        type: String,
        enum: ResultInterview,
        default: ResultInterview.PENDING
    },
    sendMail: {
        type: Boolean,
        default: false
    },
    roundProcess: {
        type: String,
        enum: RoundProcess,
        required: true,
        default: RoundProcess.CV
    }
},
    {
        timestamps: true
    });
const RecruitmentModel = mongoose.model(Collections.RECRUITMENT, recruimentSchema);
export default RecruitmentModel;