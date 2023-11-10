import * as yup from 'yup';
const registerClautidSchema = yup.object({
    body: yup.object({
        emailCandidate: yup.string().required('Bạn cần cung cấp email ứng viên!'),
        form: yup.string().oneOf(["ONLINE", "OFFLINE"], "Bạn cần chọn ONLINE hoặc OFFLINE").required('Bạn cần chọn hình thức dự thính!'),
        location: yup.string().required('Bạn chưa chọn hình thức dự thính!').when(["form"], (form, schema) => {
            if (form[0] === "OFFLINE") return schema.required('Bạn cần chọn cơ sở dự thính!');
            return schema.notRequired();
        }),
        date: yup.string().required('Bạn cần cung cấp ngày dự thính!'),
    }),
});
const feedbackClautid = yup.object({
    body: yup.object({
        class: yup.string().required('Chưa có thông tin lớp dự thính!'),
        candidateId: yup.string().required('Chưa có thông tin ứng viên!'),
        contentSession: yup.string().required('Chưa có nội dung học!'),
        countTime: yup.string().required('Chưa có lần dự thính'),
        fbST: yup.string().required('Bạn cần điền đánh giá giảng viên!'),
        fbMT: yup.string().required('Bạn cần điền đánh giá mentor!'),
    }),
});
export {
    registerClautidSchema,
    feedbackClautid
}
