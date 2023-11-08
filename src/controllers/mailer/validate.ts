import * as yup from 'yup';

const sendMailSchema = yup.object({
    // body: yup.object({
    //     email: yup.string().email('Bạn cần nhập đúng định dạng email!').required('Bạn cần nhập email!'),
    //     password: yup.string().required('Bạn cần nhập mật khẩu!')
    // }),
});

export {
    sendMailSchema
}