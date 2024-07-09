import mongoose, { Schema } from "mongoose";
import { Collections } from "../../database";
import { ClassForm, STATUS_CLASS } from "../../global/enum";

const classSchema = new mongoose.Schema({
    codeClass: {
        type: String,
        required: true,
        unique: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: Collections.COURSE,
    },
    courseLevelId: {
        type: Schema.Types.ObjectId,
        ref: Collections.COURSELEVEL
    },
    cxo: String,
    bu: String,
    cxoId: {
        type: Schema.Types.ObjectId,
        ref: Collections.CS
    },
    buId: {
        type: Schema.Types.ObjectId,
        ref: Collections.LOCATION
    },
    dayRange: {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        },
    },
    timeSchedule: {
        type: [Schema.Types.ObjectId],
        ref: Collections.TIMESCHEDULE
    },
    status: {
        type: String,
        enum: STATUS_CLASS,
        default: STATUS_CLASS.PREOPEN
    },
    classForm: {
        type: String,
        enum: ClassForm,
        default: ClassForm.HYBRID
    },
    linkZoom: {
        type: String,
        default: ''
    },
    note: {
        type: String,
        default: ''
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const ClassModel = mongoose.model(Collections.CLASS, classSchema);
export default ClassModel;