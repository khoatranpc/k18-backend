import mongoose from "mongoose";
import { Collections } from "../../database";

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const SubjectModel = mongoose.model(Collections.SUBJECT, subjectSchema);

export default SubjectModel;