import crypto from 'crypto';
import mongoose, { Schema } from "mongoose";
import { Collections } from "../../database";

const courseLevelSchema = new mongoose.Schema({
    levelName: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    levelCode: {
        type: String,
        required: true
    },
    levelImage: {
        type: String,
        default: ''
    },
    levelDescription: {
        type: String,
        default: ''
    },
    textbook: {
        type: String,
        default: ''
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: Collections.COURSE,
        required: true
    },
    levelNumber: {
        type: Number,
        required: true
    },
    record: {
        type: String,
        default: ''
    },
    techRequirements: {
        type: [{
            id: {
                type: String,
                default: () => {
                    return crypto.randomUUID();
                }
            },
            tech: {
                type: String,
                required: true
            },
            isStrong: {
                type: Boolean,
                default: false
            }
        }],
        required: true
    },
    slide: String,
    teachingGuide: String,
    lessonPlan: String,
    practice: String,
    quiz: String
}, {
    timestamps: true
});

const CourseLevelModel = mongoose.model(Collections.COURSELEVEL, courseLevelSchema);
export default CourseLevelModel;