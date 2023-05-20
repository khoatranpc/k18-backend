import mongoose, { Schema } from "mongoose";
import { Collections } from "../../database";
import { ROLE_TEACHER } from "../../global/enum";

const teacherScheduleSchema = new mongoose.Schema({
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: Collections.TEACHER,
        required: true
    },
    classSessionId: {
        type: Schema.Types.ObjectId,
        ref: Collections.CLASSSESSION,
        required: true
    },
    role: {
        type: String,
        enum: ROLE_TEACHER,
        required: true
    },
    isReplaceTeacher: {
        type: Boolean,
        default: false,
    },
    active: Boolean
});

const TeacherScheduleModel = mongoose.model(Collections.TEACHERSCHEDULE, teacherScheduleSchema);
export default TeacherScheduleModel;