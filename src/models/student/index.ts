import mongoose from "mongoose";
import { Collections } from "../../database";

const studentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});
const StudentModel = mongoose.model(Collections['STUDENT'], studentSchema);
export default StudentModel;