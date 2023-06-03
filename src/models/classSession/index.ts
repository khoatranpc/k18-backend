import mongoose, { Schema } from "mongoose";
import { Collections } from "../../database";

const classSessionSchema = new mongoose.Schema({
    classId: {
        type: Schema.Types.ObjectId,
        ref: Collections.CLASS,
        required: true
    },
    locationId: {
        type: Schema.Types.ObjectId,
        ref: Collections.LOCATION,
        required: true
    },
    sessionNumber: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    document: {
        type: String,
        default: ''
    },
    weekdayTimeScheduleId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: Collections.TIMESCHEDULE
    },
    isOH: {
        type: Boolean,
        default: false
    }
});

const ClassSessionModel = mongoose.model(Collections.CLASSSESSION, classSessionSchema);
export default ClassSessionModel;