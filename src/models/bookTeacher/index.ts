import mongoose, { Schema } from "mongoose";
import { Collections } from "../../database";

const bookTeacherSchema = new mongoose.Schema({
    classId: {
        type: Schema.Types.ObjectId,
        ref: Collections.CLASS
    },
    locationId: {
        type: Schema.Types.ObjectId,
        ref: Collections.LOCATION
    },
    teacherRegister: {
        // pending teacher collection
        type: [],
        default: []
    }
});
const BookTeacherModel = mongoose.model(Collections.BOOKTEACHER, bookTeacherSchema);
export default BookTeacherModel;