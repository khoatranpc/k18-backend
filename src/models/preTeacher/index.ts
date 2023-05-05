import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Collections } from "../../database";
import { GENDER, ROLE_TEACHER, STATUS } from "../../global/enum";

const preTeacherSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: STATUS,
            default: STATUS.PD
        },
        email: {
            type: String,
            required: true
        },
        fullName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            default: GENDER.NA,
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        identify: {
            type: String,
            required: true
        },
        licenseDate: {
            type: Date,
            required: true,
        },
        licensePlace: {
            type: String,
            required: true,
        },
        permanentAddress: {
            type: String,
            required: false
        },
        taxCode: {
            type: String,
            required: false
        },
        facebookLink: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        educationInfo: {
            type: String,
            required: true
        },
        companyInfo: {
            type: String,
            required: true
        },
        background: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        CVfile: {
            type: String,
            required: true
        },
        bankName: {
            type: String,
            required: true
        },
        bankNumber: {
            type: String,
            required: true
        },
        bankHolderName: {
            type: String,
            required: true
        },
        role: {
            type: [String],
            required: true,
        },
        dateStartWork: {
            type: Date,
            required: true
        },
        coursesRegister: {
            type: [{
                idCourse: {
                    type: Schema.Types.ObjectId,
                    ref: Collections.COURSE
                },
                levelHandle: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: Collections.COURSELEVEL
                    }
                ]
            }],
            required: true
        },
    },
    {
        timestamps: true,
    }
);
const PreTeacherModel = mongoose.model(Collections.PRETEACHER, preTeacherSchema);
export default PreTeacherModel;