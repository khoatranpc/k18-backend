import mongoose, { Schema } from "mongoose";
import { Collections } from "../../database";
import { STATUS_CLASS } from "../../global/enum";

const classSchema = new mongoose.Schema({
    codeClass: {
        type: String,
        required: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: Collections.COURSE,
    },
    courseLevelId: {
        type: Schema.Types.ObjectId,
        ref: Collections.COURSELEVEL
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
    }
})

const ClassModel = mongoose.model(Collections.CLASS, classSchema);
export default ClassModel;