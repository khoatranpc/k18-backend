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
    },
    timeFirst: {
        type: Date,
    },
    timeFirstDone: {
        type: Boolean,
        default: false
    },
    locationFirst: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.LOCATION,
    },
    formFirst: {
        type: String,
        enum: ClassForm,
    },
    classIdSecond: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.CLASS,
    },
    timeSecond: {
        type: Date,
    },
    timeSecondDone: {
        type: Boolean,
        default: false
    },
    locationSecond: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.LOCATION,
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