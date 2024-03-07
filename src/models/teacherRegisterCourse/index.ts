import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Collections } from "../../database";

const teacherRegisterCourseSchema = new mongoose.Schema(
    {
        idTeacher: {
            type: Schema.Types.ObjectId,
            ref: Collections.TEACHER,
            required: true
        },
        teacherEmail: {
            type: String,
            unique: true,
        },
        coursesRegister: {
            type: [{
                idCourse: {
                    type: Schema.Types.ObjectId,
                    ref: Collections.COURSE
                },
                levelHandle: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: Collections.COURSELEVEL
                    }
                ]
            }],
            required: true
        },
    },
    {
        timestamps: true,
    }
);
const TeacherRegisterCourseModel = mongoose.model(Collections.TEACHERREGISTERCOURSE, teacherRegisterCourseSchema);
export default TeacherRegisterCourseModel;