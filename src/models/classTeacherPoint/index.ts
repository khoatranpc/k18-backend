import mongoose from "mongoose";
import { Collections } from "../../database";

const classTeacherPointSchema = new mongoose.Schema({
    classId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.CLASS
    },
    feedbackId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.FEEDBACK
    },
    timeCollect: {
        type: Number,
        required: true
    },
    teacherPoint: Number
}, {
    timestamps: true
});

const ClassTeacherPointModel = mongoose.model(Collections.CLASSTEACHERPOINT, classTeacherPointSchema);
export default ClassTeacherPointModel;