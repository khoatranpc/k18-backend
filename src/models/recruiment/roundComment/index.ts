import mongoose from "mongoose";
import { createModel } from "../../../utils/model";
import { Collections } from "../../../database";

const RoundCommentModel = createModel('ROUNDCOMMENT', {
    roundId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.ACCOUNT,
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
export default RoundCommentModel;