import mongoose, { Schema } from "mongoose";
import { Collections } from "../../database";

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        unique: true
    },
    syllabus: {
        type: String,
        default: ''
    },
    courseLevel: {
        type: [Schema.Types.ObjectId],
        ref: Collections.COURSELEVEL
    },
    courseTitle: {
        type: String,
        default: ''
    },
    courseDescription: {
        type: String,
        default: ''
    },
    courseImage: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    },
    color: {
        type: String,
        default: '',
        required: true
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: Collections.SUBJECT
    }
}, {
    timestamps: true
})

const CourseModel = mongoose.model(Collections.COURSE, courseSchema);
export default CourseModel;