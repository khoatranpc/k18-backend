import * as yup from 'yup';
const createDocument = yup.object({
    body: yup.object({
        docTitle: yup.string().required('Chưa có tiêu đề tài liệu!'),
        docDescribe: yup.string().required('Chưa có mô tả tài liệu!'),
    })
});
export {
    createDocument
}