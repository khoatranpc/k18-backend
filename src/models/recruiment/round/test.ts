import mongoose from "mongoose";
import { Collections } from "../../../database";

const roundTestSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.RECRUITMENT
    },
    linkMeet: {
        type: String,
        required: true
    },
    doc: {
        type: String,
        required: true
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

const RoundTestModel = mongoose.model(Collections.ROUNDTEST, roundTestSchema);
export default RoundTestModel;