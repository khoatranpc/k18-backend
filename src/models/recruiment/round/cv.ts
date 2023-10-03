import mongoose from "mongoose";
import { Collections } from "../../../database";

const roundCVSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.RECRUITMENT
    },
    result: {
        type: Boolean,
        default: false
    }
});

const RoundCVModel = mongoose.model(Collections.ROUNDCV, roundCVSchema);
export default RoundCVModel;