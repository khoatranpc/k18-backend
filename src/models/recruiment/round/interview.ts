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
    }
});

const       RoundInterviewModel = mongoose.model(Collections.ROUNDINTERVIEW, roundInterviewSchema);
export default RoundInterviewModel;