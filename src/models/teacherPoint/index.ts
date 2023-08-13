import mongoose from "mongoose";
import { Collections } from "../../database";

const teacherPointSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.TEACHER
    },
    point: {
        type: Number,
        required: true
    },
    feedbackResponseId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.FEEDBACKRESPONSE
    },
    classId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.CLASS
    },
    groupNumber: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.BOOKTEACHER
    }
}, {
    timestamps: true
});
const TeacherPointModel = mongoose.model(Collections.TEACHERPOINT, teacherPointSchema);
export default TeacherPointModel;