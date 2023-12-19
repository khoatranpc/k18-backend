import mongoose from "mongoose";
import { PositionTe } from "../../global/enum";
import { Collections } from "../../database";

const teSchema = new mongoose.Schema({
    teName: {
        type: String,
        required: true
    },
    positionTe: {
        type: String,
        enum: PositionTe,
        required: true
    },
    courseId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.COURSE
    },
    accountId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.ACCOUNT,
        required: true,
        unique: true
    },
    facebook: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dob: Date,
    activate: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const TeModel = mongoose.model(Collections.TE, teSchema);
export default TeModel;