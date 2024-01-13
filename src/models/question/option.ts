import mongoose from "mongoose";
import { Collections } from "../../database";
import { TypeQuestion } from "../../global/enum";

const optionSchema = new mongoose.Schema({
    content: String,
    questionId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections['QUESTION'],
        required: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: TypeQuestion,
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    order: Number
}, {
    timestamps: true
});
const OptionModel = mongoose.model(Collections['OPTION'], optionSchema);

export default OptionModel;