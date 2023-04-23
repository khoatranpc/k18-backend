import mongoose from "mongoose";
import { Collections } from "../../database";
import { WEEKDAY } from "../../global/enum";

const timeScheduleSchema = new mongoose.Schema({
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    weekday: {
        type: String,
        enum: WEEKDAY,
        required: true
    },
});

const TimeScheduleModel = mongoose.model(Collections.TIMESCHEDULE, timeScheduleSchema);
export default TimeScheduleModel;