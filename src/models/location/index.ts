import mongoose from "mongoose";
import { Collections } from "../../database";

const locationSchema = new mongoose.Schema({
    locationCode: {
        type: String,
        required: true,
        unique: true
    },
    locationName: String,
    area: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections.AREA
    },
    locationDetail: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
});
const LocationModel = mongoose.model(Collections.LOCATION, locationSchema);
export default LocationModel;