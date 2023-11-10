import mongoose from "mongoose";
import { Collections } from "../../../database";

const feedbackClautidSchema = new mongoose.Schema({
    class: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.CLASS,
        required: true
    },
    candidateId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.RECRUITMENT,
        required: true
    },
    contentSession: {
        type: String,
        required: true
    },
    countTime: {
        type: Number,
        required: true
    },
    fbDoc: {
        type: String,
    },
    fbST: {
        type: String,
        required: true
    },
    fbMT: {
        type: String,
        required: true
    },
}, { timestamps: true });
const FeedbackClautidModel = mongoose.model(Collections.FEEDBACK_CLAUTID, feedbackClautidSchema);
export default FeedbackClautidModel;