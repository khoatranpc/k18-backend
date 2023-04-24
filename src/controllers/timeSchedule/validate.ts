import * as yup from 'yup';
const createTimeScheduleSchema = yup.object({
    body: yup.object({
        start: yup.string().required('Chưa có giờ bắt đầu!'),
        end: yup.string().required('Chưa có giờ kết thúc!'),
        weekday: yup.string().required('Chưa có ngày trong tuần!'),
    })
});
export {
    createTimeScheduleSchema
}