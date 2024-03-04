import mongoose from "mongoose";
import { Collections } from "../../../database";

const roundInterviewSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.RECRUITMENT
    },
    linkMeet: {
        type: String
    },
    time: {
        type: Date
    },
    result: {
        type: Boolean,
        default: false
    },
    processed: {
        type: Boolean,
        default: false
    },
    te: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.TE
    },
    mailInterviewSent: {
        type: Boolean,
        default: false
    },
    mailResultSent: {
        type: Boolean,
        default: false
    },
    eventCalendarId: {
        type: String,
        default: ''
    }
});

const RoundInterviewModel = mongoose.model(Collections.ROUNDINTERVIEW, roundInterviewSchema);
export default RoundInterviewModel;