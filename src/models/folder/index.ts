import mongoose from "mongoose";
import { Collections } from "../../database";
import { ROLE } from "../../global/enum";

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    content: String,
    level: {
        type: Number,
        required: true,
        default: 1
    },
    path: {
        type: String
    },
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections["FOLDER"]
    },
    share: {
        type: [
            {
                type: String,
                enum: ROLE
            }
        ],
        default: [ROLE.TE]
    },
    type: {
        type: String,
        default: 'FOLDER'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});
const FolderModel = mongoose.model(Collections["FOLDER"], folderSchema);
export default FolderModel;