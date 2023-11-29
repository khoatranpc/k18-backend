import mongoose from "mongoose";
import { Collections } from "../../database";
import { Region } from "../../global/enum";

const areaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: String
    },
    code: {
        type: String,
        required: String
    },
    region: {
        type: String,
        required: true,
        enum: Region
    }
});
const AreaModel = mongoose.model(Collections.AREA, areaSchema);
export default AreaModel;