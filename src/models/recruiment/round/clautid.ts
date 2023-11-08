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