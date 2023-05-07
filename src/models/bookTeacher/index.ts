import mongoose, { Schema } from "mongoose";
import { Collections } from "../../database";
import { ROLE_TEACHER } from "../../global/enum";

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
        type: [{
            idTeacher: {
                type: Schema.Types.ObjectId,
                ref: Collections.TEACHER,
                required: true
            },
            roleRegister: {
                type: String,
                enum: ROLE_TEACHER
            },
            accept: {
                type: Boolean,
                default: false
            }
        }],
        default: []
    }
});
const BookTeacherModel = mongoose.model(Collections.BOOKTEACHER, bookTeacherSchema);
export default BookTeacherModel;