import mongoose, { Schema } from "mongoose";
import crypto from "crypto";
import { Collections } from "../../database";
import { GENDER, TeachingDepartment } from "../../global/enum";

const teacherSchema = new mongoose.Schema(
    {
        idAccount: {
            type: Schema.Types.ObjectId,
            ref: Collections.ACCOUNT
        },
        isOffical: {
            type: Boolean,
            default: false
        },
        email: {
            type: String,
            default: '',
            // required: true,
            unique: true,
        },
        fullName: {
            type: String,
            default: '',
            // required: true,
        },
        phoneNumber: {
            type: String,
            default: '',
            //  required: true
        },
        gender: {
            type: String,
            default: GENDER.NA,
            // required: true
        },
        dob: {
            type: Date,
            // required: true
        },
        identify: {
            type: String,
            default: '',
            // required: true
        },
        licenseDate: {
            type: Date,
            // required: true,
        },
        licensePlace: {
            type: String,
            default: '',
            // required: true,
        },
        permanentAddress: {
            type: String,
            default: '',
            required: false
        },
        taxCode: {
            type: String,
            default: '',
            required: false
        },
        facebookLink: {
            type: String,
            default: '',
            required: false
        },
        area: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: Collections.AREA,
            // required: true
        },
        educationInfo: {
            type: String,

            default: '',
        },
        companyInfo: {
            type: String,

            default: '',
        },
        background: {
            type: String,

            default: '',
        },
        address: {
            type: String,

            default: '',
        },
        CVfile: {
            type: String,

            default: '',
        },
        bankName: {
            type: String,

            default: '',
        },
        bankNumber: {
            type: String,

            default: '',
        },
        bankHolderName: {
            type: String,
            default: '',
        },
        roleIsST: {
            type: Boolean,
            default: false,
        },
        roleIsMT: {
            type: Boolean,
            default: false,
        },
        roleIsSP: {
            type: Boolean,
            default: false,
        },
        dateStartWork: {
            type: Date,
            default: new Date(),
            required: false,
        },
        salaryPH: {
            type: [
                {
                    index: {
                        type: String,
                        default: crypto.randomUUID()
                    },
                    rank: {
                        type: Number,
                        default: 0,
                        required: true
                    },
                    updateAt: {
                        type: Date,
                        default: new Date()
                    }
                }
            ],
            default: []
        },
        teacherPoint: {
            type: Number,
            default: 0
        },
        note: String,
        img: String,
        frontId: String,
        backId: String,
        infoAllowance: String,
        teachingDepartment: {
            type: [String],
            enum: TeachingDepartment,
            required: false
        },
        certificate: String,
        certificatePhotoImage: String,
        emergencyContact: {},
        profileLink: String
    },
    {
        timestamps: true,
    }
);
const TeacherModel = mongoose.model(Collections.TEACHER, teacherSchema);
export default TeacherModel;