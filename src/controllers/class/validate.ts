import * as yup from 'yup';

const createClassSchema = yup.object({
    body: yup.object({
        codeClass: yup.string().required('Bạn chưa cung cấp mã lớp!'),
        courseId: yup.string().required('Bạn chưa cung cấp khóa học!'),
        courseLevelId: yup.string().required('Bạn chưa cung cấp cấp độ khóa học!'),
        dayRange: yup.object({
            start: yup.date().required('Bạn chưa cung cấp ngày mở lớp!'),
            end: yup.date().required('Bạn chưa cung cấp ngày kết thúc lớp!'),
        }).required('Bạn chưa cung cấp thời gian tổ chức khóa học!'),
        bookTeacher: yup.array().required('Chưa có thông tin dự kiến nhóm lớp!')
    })
});

export {
    createClassSchema
}