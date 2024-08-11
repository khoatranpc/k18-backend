import mongoose from "mongoose";
import { Collections } from "../../database";
import { PositionCs } from "../../global/enum";

const csSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: String,
    image: String,
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
    },
    position: {
        type: String,
        enum: PositionCs,
        default: PositionCs.EXECUTIVE
    }
}, {
    timestamps: true
});
const CSmodel = mongoose.model(Collections.CS, csSchema);
export default CSmodel;