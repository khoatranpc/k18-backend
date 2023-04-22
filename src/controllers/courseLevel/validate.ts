import * as yup from 'yup';
const createCourseLevelSchema = yup.object({
    body: yup.object({
        levelName: yup.string().required('Thiếu tên cấp độ!'),
        levelCode: yup.string().required('Thiếu mã cấp độ!'),
        courseId: yup.string().required('Chưa có id khóa học!'),
    })
});
export {
    createCourseLevelSchema
}