import * as yup from 'yup';
const validateCreateSessionBody = yup.object({
    query: yup.object({
        options: yup.string().oneOf(['ADD', 'UPDATE', 'DELETE'], 'options phải là ADD hoặc DELETE hoặc UPDATE!').required('Bạn cần truyền options!')
    }),
});
export { validateCreateSessionBody };