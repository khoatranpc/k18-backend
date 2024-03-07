import mongoose from "mongoose";
import { Collections } from "../../database";
import { ROLE } from "../../global/enum";

const accountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ROLE,
        default: ROLE.TEACHER
    },
    activate: {
        type: Boolean,
        default: false
    },
    salt: String,
    otp: {
        type: String
    },
    expiresInOtp: {
        type: Date
    }
}, {
    timestamps: true
})

const AccountModel = mongoose.model(Collections.ACCOUNT, accountSchema);
export default AccountModel;