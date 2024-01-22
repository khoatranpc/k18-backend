import mongoose from "mongoose";
import { Collections } from "../../database";

const teacherRequestOnLeave = new mongoose.Schema({
    classSessionId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections['CLASSSESSION'],
        required: true
    },
    teacherId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections['TEACHER'],
        required: true
    },
    cancel: {
        type: Boolean,
        default: false
    },
    teacherReplace: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Collections['TEACHER']
    }
}, {
    timestamps: true
});
const RequetsOnLeaveModel = mongoose.model(Collections['TEACHERREQUESTONLEAVE'], teacherRequestOnLeave);

export default RequetsOnLeaveModel;