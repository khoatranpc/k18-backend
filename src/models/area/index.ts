import mongoose from "mongoose";
import { Collections } from "../../database";

const areaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: String
    }
});
const AreaModel = mongoose.model(Collections.AREA, areaSchema);
export default AreaModel;