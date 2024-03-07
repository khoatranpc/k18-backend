import { Area, GENDER, ROLE_TEACHER } from "../../global/enum";
import { Obj } from "../../global/interface";

const labelGender: Record<GENDER, string> = {
    FEMALE: 'Nữ',
    MALE: 'Nam',
    NA: 'Khác'
}
const labelArea: Record<Area, string> = {
    HN: 'TP. HN',
    ANT: 'Khác',
    DN: 'TP. Đà Nẵng',
    HCM: 'TP. HCM',
    ONL: 'ONLINE'
}
const labelTeachingDepartment = {
    K18: 'Khối 18+',
    K12: 'Khối 12+'
}
const labelRole: Record<ROLE_TEACHER, string> = {
    MT: 'Mentor',
    SP: 'Support',
    ST: 'Giáo viên'
}
const orderLevelCourse = {
    Lv1: 1,
    Lv2: 2,
    Lv3: 3,
    Lv4: 4,
}

function getKeyByValue(object: Obj, value: any) {
    for (const key in object) {
        if (object[key] === value) {
            return key;
        }
    }
    return null; // Trả về null nếu không tìm thấy giá trị
}
function isValidDate(dateString: string) {
    // Ép kiểu chuỗi thành đối tượng ngày tháng
    const dateObject = new Date(dateString);
    return !isNaN(dateObject.getTime());
}
function convertStringToDate(dateString: string) {
    // Phân tách chuỗi ngày tháng thành mảng gồm ngày, tháng và năm
    const dateParts = dateString.split('/');

    // Lấy các phần tử từ mảng dateParts
    const day = parseInt(dateParts[0], 10); // parseInt để chuyển chuỗi thành số
    const month = parseInt(dateParts[1], 10) - 1; // Giảm đi 1 vì tháng trong đối tượng Date bắt đầu từ 0
    const year = parseInt(dateParts[2], 10);

    // Tạo đối tượng Date mới từ ngày, tháng và năm đã phân tách
    const dateObject = new Date(year, month, day);

    return dateObject;
}
export {
    labelGender,
    labelArea,
    labelTeachingDepartment,
    labelRole,
    orderLevelCourse,
    getKeyByValue,
    isValidDate,
    convertStringToDate
}