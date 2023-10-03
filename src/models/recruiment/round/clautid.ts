import mongoose from "mongoose";
import { ClassForm } from "../../../global/enum";
import { Collections } from "../../../database";

const roundClautidSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.RECRUITMENT
    },
    classIdFirst: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.CLASS,
        requried: true
    },
    timeFirst: {
        type: Date,
        required: true
    },
    timeFirstDone: {
        type: Boolean,
        default: false
    },
    formFirst: {
        type: String,
        enum: ClassForm
    },
    classIdSecond: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.CLASS,
        requried: true
    },
    timeSecond: {
        type: Date,
        required: true
    },
    timeSecondDone: {
        type: Boolean,
        default: false
    },
    formSecond: {
        type: String,
        enum: ClassForm
    },
    result: {
        type: Boolean,
        default: false
    }
});

const RoundClautidModel = mongoose.model(Collections.ROUNDCLAUTID, roundClautidSchema);
export default RoundClautidModel;