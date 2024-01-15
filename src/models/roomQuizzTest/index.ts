import mongoose from "mongoose";
import { Collections } from "../../database";

const roomQuizzTestSchema = new mongoose.Schema({
    codeClass: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    questionId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections['QUESTION']
    }
}, {
    timestamps: true
});
const RoomQuizzTestModel = mongoose.model(Collections['ROOM_QUIZZ_TEST'], roomQuizzTestSchema);
export default RoomQuizzTestModel