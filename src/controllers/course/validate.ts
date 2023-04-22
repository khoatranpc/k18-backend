import * as yup from 'yup';

const createCourseSchema = yup.object({
    body: yup.object({
        courseName: yup.string().required('Chưa có tên khóa học!')
    })
})
const updateCourseSchema = yup.object({
    body: yup.object({
        courseName: yup.string().required('Chưa có giá trị cập nhật!')
    }),
    params: yup.object({
        id: yup.string().required('Chưa có id khóa học!')
    }),
})
export {
    createCourseSchema,
    updateCourseSchema
}