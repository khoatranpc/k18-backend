import mongoose from "mongoose";
import { Collections } from "../../database";

const feedbackResponseSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.COURSE
    },
    codeClass: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.CLASS
    },
    groupNumber: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.BOOKTEACHER,
        required: true
    }
}, {
    timestamps: true
});
const FeedbackResponseModel = mongoose.model(Collections.FEEDBACKRESPONSE, feedbackResponseSchema);
export default FeedbackResponseModel;