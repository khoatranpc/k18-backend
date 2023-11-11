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
    },
    doc: {
        type: String,
    },
    time: {
        type: Date,
    },
    te: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.TE
    },
    result: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const RoundTestModel = mongoose.model(Collections.ROUNDTEST, roundTestSchema);
export default RoundTestModel;