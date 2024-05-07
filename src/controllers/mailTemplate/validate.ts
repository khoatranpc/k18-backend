import * as yup from 'yup';
import { TemplateMail } from '../../global/enum';

const createMailTemplateSchema = yup.object({
    body: yup.object({
        html: yup.string().required('Bạn chưa cung cấp nội dung!'),
        title: yup.string().required('Bạn chưa cung cấp tiêu đề!'),
        template: yup.string().oneOf(Object.keys(TemplateMail), 'template không hợp lệ!'),
    }),
});
const updateMailTemplateSchema = yup.object({
    body: yup.object({
        html: yup.string().required('Bạn chưa cung cấp nội dung!'),
        title: yup.string().required('Bạn chưa cung cấp tiêu đề!'),
    }),
});
export {
    createMailTemplateSchema,
    updateMailTemplateSchema
}