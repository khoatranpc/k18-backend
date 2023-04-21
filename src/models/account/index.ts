import mongoose from "mongoose";
import { Collections } from "../../database";
import { ROLE } from "../../global/enum";

const accountchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
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
    salt: String
})

const AccountModel = mongoose.model(Collections.ACCOUNT, accountchema);
export default AccountModel;