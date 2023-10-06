import mongoose from "mongoose";
import { createModel } from "../../../utils/model";
import { Collections } from "../../../database";

const RoundCommentModel = createModel('ROUNDCOMMENT', {
    roundId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    teId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Collections.TE,
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
export default RoundCommentModel;