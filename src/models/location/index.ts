import mongoose from "mongoose";
import { Collections } from "../../database";

const locationSchema = new mongoose.Schema({
    locationCode: {
        type: String,
        required: true
    },
    locationName: String,
    area: {},
    locationDetail: {
        type: String,
        required: true
    },
});
const LocationModel = mongoose.model(Collections.LOCATION, locationSchema);
export default LocationModel;