import * as yup from 'yup';
const validateCreateSessionBody = yup.object({
    query: yup.object({
        // ADD, UPDATE, DELETE is handle teacher in class session
        // RAN is change status run of class session by ran, checked all teacher in class session
        options: yup.string().oneOf(['ADD', 'UPDATE', 'DELETE', 'RAN'], 'options phải là ADD hoặc DELETE hoặc UPDATE hoặc RAN!').required('Bạn cần truyền options!')
    }),
});
const validateaOnLeave = yup.object({
    body: yup.object({
        classId: yup.string().required('Bạn cần gửi id của class (classId)!'),
        classSessionId: yup.string().required('Bạn cần gửi id của buổi học (classSessionId)!'),
        onLeave: yup.string().oneOf(['REPLACE', 'OFF'], 'Không xác định được yêu cầu nghỉ phép (onLeave: REPLACE hoặc OFF)!').required('Bạn cần truyền onLeave!'),
        replaceTeacherId: yup.string().required('Bạn cần gửi thông tin giáo viên thay thế (replaceTeacherId)!'),
        currentTeacherId: yup.string().required('Bạn cần gửi thông tin giáo viên hiện tại (currentTeacherId)!'),
    })
});
const getAttendanceTeacher = yup.object({
    query: yup.object({
        classId: yup.string().required('Bạn cần cung cấp classId!'),
        sessionNumber: yup.string().required('Bạn cần cung cấp sessionNumber!'),
    })
});
export { validateCreateSessionBody, validateaOnLeave, getAttendanceTeacher };