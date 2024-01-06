import mongoose from "mongoose";
import { Collections } from "../../database";
import { ROLE } from "../../global/enum";

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: String,
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
        default: 'FILE'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});
const FileModel = mongoose.model(Collections["FILE"], fileSchema);
export default FileModel;