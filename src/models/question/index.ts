import mongoose from "mongoose";
import { Collections } from "../../database";
import { TypeQuestion } from "../../global/enum";

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    collectionQuizId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections['COLLECTIONQUIZ'],
        required: true
    },
    type: {
        type: String,
        enum: TypeQuestion,
        default: TypeQuestion.QUIZ
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const QuestionModel = mongoose.model(Collections['QUESTION'], questionSchema);

export default QuestionModel;