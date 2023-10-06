import * as yup from 'yup';

const createRecordDataRound = yup.object({
    body: yup.object({
        candidateId: yup.string().required('Bạn cần cung cấp candidateId!'),
        round: yup.string().oneOf(['INTERVIEW', 'CLAUTID', 'TEST'], 'round không hợp lệ!').required('Bạn chưa cung cấp round process!')
    }),
});
const updateRecoredDataRound = yup.object({
    body: yup.object({
        result: yup.boolean().required('Bạn cần cung cấp kết quả!'),
        round: yup.string().oneOf(['INTERVIEW', 'CLAUTID', 'TEST', 'CV'], 'round không hợp lệ!').required('Bạn chưa cung cấp round process!')
    }),
});
export {
    createRecordDataRound,
    updateRecoredDataRound
}
