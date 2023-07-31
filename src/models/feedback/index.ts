import mongoose from 'mongoose';
import { Collections } from '../../database';
const feedbackSchema = new mongoose.Schema({
    codeClass: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.CLASS
    },
    codeClassText: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    numberCollected: {
        type: Number,
        required: true
    },
    done: {
        type: Boolean,
        required: true,
        default: false,
    },
    enabled: {
        type: Boolean,
        required: true,
        default: false,
    },
});
const FeedbackModel = mongoose.model(Collections.FEEDBACK, feedbackSchema);
export default FeedbackModel;