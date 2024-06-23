import mongoose from "mongoose";
import { Collections } from "../../database";

const csSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    accountId: {
        type: mongoose.Types.ObjectId,
        ref: Collections.ACCOUNT
    },
    area: {
        type: mongoose.Types.ObjectId,
        ref: Collections.AREA
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const CSmodel = mongoose.model(Collections.CS, csSchema);
export default CSmodel;