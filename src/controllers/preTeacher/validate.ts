import * as yup from 'yup';
const preTeacherSchema = yup.object({
    body: yup.object({
        email: yup.string().required('Bạn cần nhập email!'),
        fullName: yup.string().required('Bạn cần điền tên đầy đủ!'),
        gender: yup.string().required('Bạn chưa chọn giới tính!'),
        phoneNumber: yup.string().required('Bạn chưa nhập SĐT!'),
        dob: yup.string().required('Bạn cần chọn ngày tháng năm sinh!'),
        dateStartWork: yup.string().required('Bạn cần chọn ngày bắt đầu làm việc!'),
        identify: yup.string().required('Bạn chưa nhập số CCCD!'),
        licenseDate: yup.string().required('Bạn chưa chọn ngày cấp!'),
        licensePlace: yup.string().required('Bạn chưa nhập nơi cấp!'),
        facebookLink: yup.string().required('Bạn chưa điền link facebook!'),
        area: yup.string().required('Bạn chưa chọn khu vực sống!'),
        educationInfo: yup.string().required('Bạn chưa điền thông tin học vấn!'),
        companyInfo: yup.string().required('Bạn chưa điền Công việc/Nơi làm việc'),
        background: yup.string().required('Bạn chưa điền lý lịch xuất phát công việc!'),
        address: yup.string().required('Bạn chưa điền địa chỉ hiện tại!'),
        CVfile: yup.string().required('Bạn chưa điền thông tin CV'),
        bankName: yup.string().required('Bạn chưa điền tên ngân hàng!'),
        bankNumber: yup.string().required('Bạn chưa điền số tài khoản!'),
        bankHolderName: yup.string().required('Bạn chưa điền tên chủ sở hữu!'),
        role: yup.string().required('Bạn cần chọn vị trí!'),
        coursesRegister: yup.string().required('Bạn cần chọn khóa học!')
    })
});
export {
    preTeacherSchema
}