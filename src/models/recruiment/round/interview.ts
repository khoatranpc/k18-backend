import mongoose from "mongoose";
import { Collections } from "../../../database";

const roundInterviewSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.RECRUITMENT
    },
    linkMeet: {
        type: String,
        requried: true
    },
    time: {
        type: Date,
        required: true
    },
    result: {
        type: Boolean,
        default: false
    }
});

const RoundInterviewModel = mongoose.model(Collections.ROUNDINTERVIEW, roundInterviewSchema);
export default RoundInterviewModel;