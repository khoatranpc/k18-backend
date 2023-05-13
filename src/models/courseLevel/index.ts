import mongoose, { Schema } from "mongoose";
import { Collections } from "../../database";

const courseLevelSchema = new mongoose.Schema({
    levelName: {
        type: String,
        required: true
    },
    levelCode: {
        type: String,
        required: true
    },
    syllabus: String,
    courseId: {
        type: Schema.Types.ObjectId,
        ref: Collections.COURSE,
        required: true
    },
    levelNumber: {
        type: Number,
        required: true
    }
});

const CourseLevelModel = mongoose.model(Collections.COURSELEVEL, courseLevelSchema);
export default CourseLevelModel;