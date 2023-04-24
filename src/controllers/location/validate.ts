import * as yup from 'yup';
const createLocationSchema = yup.object({
    body: yup.object({
        locationCode: yup.string().required('Chưa có mã cơ sở!'),
        locationDetail: yup.string().required('Chưa có địa chỉ chi tiết cơ sở!'),
    })
});
export {
    createLocationSchema
}