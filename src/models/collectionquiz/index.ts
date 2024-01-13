import mongoose from "mongoose";
import { Collections } from "../../database";

const collectionQuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    courseId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections['COURSE'],
        required: true
    },
    levelId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections['COURSELEVEL'],
        required: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const CollectionQuizModel = mongoose.model(Collections['COLLECTIONQUIZ'], collectionQuizSchema);

export default CollectionQuizModel;