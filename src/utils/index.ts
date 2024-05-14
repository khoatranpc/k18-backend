import { Request, Response } from 'express';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { JwtVerify, Obj } from '../global/interface';
import { Education, LevelTechnique, ResourceApply, WEEKDAY } from '../global/enum';

const genRandomId = () => {
    return uuidv4()
};

const getProjection = (...fields: Array<string>) => {
    if (fields !== undefined) {
        const filedsProjection: Obj = {};
        fields.forEach((item) => {
            filedsProjection[item] = 1
        });
        return filedsProjection
    }
    return {}
}
function resClientData(req: Request, res: Response, statusCode: number, data: any, message?: string, notSendPayload?: boolean) {
    res.status(statusCode).send({
        data,
        message: message ? message : (!!data ? 'Thành công!' : 'Thất bại!'),
        status: data ? true : false,
        query: !notSendPayload ? {
            body: req.body,
            params: req.params,
            query: req.query
        } : {}
    })
}
function generateJWT(data: Obj) {
    const token = jwt.sign(data, process.env.PRIVATE_KEY_JWT as string, {
        expiresIn: 60 * Number(process.env.JWT_EXPRISE),
    });
    return { token: token };
}
function verifyJWT(token: string): JwtVerify | string {
    try {
        const verifyToken = jwt.verify(token, process.env.PRIVATE_KEY_JWT as string, (err, data) => {
            if (data) return data;
            if (err) return err.message;
        });
        return verifyToken as unknown as JwtVerify;
    } catch (error: any) {
        return "jwt " + error.message
    }
}

export const encryptPassword = (password: string, saltUser?: string) => {
    // Private key for single user
    const salt = saltUser ?? crypto.randomBytes(128).toString("hex");
    // Hashed password
    const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");

    return {
        salt: salt,
        hashedPassword: hashedPassword,
    };
};

const verifyPassword = (password: string, acc: Obj) => {
    const hashedPassword = crypto
        .pbkdf2Sync(password, acc?.salt as string, 10000, 64, "sha512")
        .toString("hex");
    return hashedPassword === acc.password;
}

const getDateOfWeekday = (date: Date, countDay: number) => {
    const newDate = date;
    newDate.setDate(newDate.getDate() + countDay);
    return newDate;
}

const getWeekDay = (dayNumber: number | undefined, toNumber?: boolean, crrWeekday?: WEEKDAY) => {
    if (!toNumber) {
        switch (dayNumber) {
            case 1:
                return WEEKDAY.T2;
            case 2:
                return WEEKDAY.T3;
            case 3:
                return WEEKDAY.T4;
            case 4:
                return WEEKDAY.T5;
            case 5:
                return WEEKDAY.T6;
            case 6:
                return WEEKDAY.T7;
            case 0:
                return WEEKDAY.CN;
            default:
                return 0
        }
    } else {
        switch (crrWeekday) {
            case WEEKDAY.T2:
                return 1;
            case WEEKDAY.T3:
                return 2;
            case WEEKDAY.T4:
                return 3;
            case WEEKDAY.T5:
                return 4;
            case WEEKDAY.T6:
                return 5;
            case WEEKDAY.T7:
                return 6;
            case WEEKDAY.CN:
                return 0;
            default:
                return 0;
        }
    }
}
const getOrderWeekday: Record<WEEKDAY, number> = {
    T2: 1,
    T3: 2,
    T4: 3,
    T5: 4,
    T6: 5,
    T7: 6,
    CN: 7
}
const formatDateToString = (date: Date) => {
    return date.toLocaleDateString("en-US");
}
const getProjectionByString = (str: string) => {
    const listField = str ? str.split(',') : [];
    const projection: Obj = {};
    listField.forEach((item) => {
        if (item) {
            projection[item] = 1;
        }
    });
    return projection;
}
const getScoreLevelTech: Record<LevelTechnique, number> = {
    INTERN: 1,
    FRESHER: 2,
    JUNIOR: 3,
    MIDDLE: 4,
    SENIOR: 5,
    LEADER: 6,
}
const getScoreResourceApply: Record<ResourceApply, number> = {
    AN: 1,
    FB: 2,
    RF: 3,
    LKD: 4,
    TCV: 3
}
const returnNumberBoolean = (field: any) => {
    return field ? 1 : 0
}
const getScoreEducation: Record<Education, number> = {
    BACHELOR: 1,
    ENGINEER: 2,
    // thạc sĩ
    MASTER: 3,
    // tiến sĩ
    DOCTOR: 4
}
const formatDateTime = (date: Date) => {
    // Lấy thông tin giờ, phút và giây
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Lấy thông tin ngày, tháng và năm
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear();

    // Chuyển đổi số liệu thành chuỗi và thêm số 0 ở trước nếu cần
    const formattedTime = [hours, minutes, seconds].map(function (unit) {
        return unit < 10 ? "0" + unit : unit;
    }).join(":");

    const formattedDate = [day, month, year].map(function (unit) {
        return unit < 10 ? "0" + unit : unit;
    }).join("-");

    // Kết hợp giờ và ngày thành định dạng cuối cùng
    const formattedDateTime = formattedTime + ", " + formattedDate;

    return formattedDateTime;
}

const mailNotifiFillFormOnboard = (name: string, success?: boolean) => {
    return success?`
    <p>Th&acirc;n gửi <strong>${name}</strong></p>
<p>Th&ocirc;ng tin của bạn đ&atilde; được ghi nhận <strong>th&agrave;nh c&ocirc;ng</strong></p>
<p>Bạn vui l&ograve;ng truy cập <a href="https://client.tms-k18.id.vn/candidate">https://client.tms-k18.id.vn/candidate</a> để tiếp tục</p>
<style type="text/css">
    p.p1 {
        margin: 0.0px 0.0px 0.0px 0.0px;
        line-height: 18.0px;
        font: 15.0px 'Helvetica Neue';
        color: #000000
    }

    span.s1 {
        text-decoration: underline
    }
</style>
<div style="text-align: start;color: rgb(34, 34, 34);font-size: small;">
    <div>
        <div>
            <div>
                <div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div>
                                        <div>
                                            <div>
                                                <div>
                                                    <div>
                                                        <div>
                                                            <div>
                                                                <div>
                                                                    <div>
                                                                        <div>
                                                                            <div>
                                                                                <div>
                                                                                    <p style="text-align: justify;"><br></p>
                                                                                    <p style="text-align: justify;">--</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div style="text-align: start;color: rgb(34, 34, 34);font-size: small;">
    <div>
        <div>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><span style="font-size: 14.6667px;"><strong>Teaching K18 Team</strong></span></p>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><strong><span style="color: rgb(0, 0, 0);font-size: 11pt;">M</span></strong><span style="color: rgb(0, 0, 0);font-size: 11pt;">&nbsp; +08 226666 64 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><strong><span style="color: rgb(0, 0, 0);font-size: 11pt;">E <span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(17, 85, 204); vertical-align: baseline;">teachingk18@mindx.edu.vn</span></span></strong><span style="color: rgb(0, 0, 0);font-size: 11pt;">&nbsp;</span><span style="color: transparent;font-size: 11pt;">teac</span></p>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><span style="color: transparent;font-size: 11pt;">--------------------------</span></p>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><span style="color: transparent;font-size: 11pt;"><span style="border: none;"><img src="https://lh5.googleusercontent.com/UkuiNxSmurwHEqrReNmuJZJvyFHdqx5n2CcJMMhff1J-dww0itwlnwRQM_RWCvCYFWZ7hw20r96X5dJ1WilIxyCdWQr9HVeKn9YM7E3dSq28_NG-9FH86SGVVEC5qLrHLbUzV7LWz8LRb0_RVBfjvErkG0mFU3IVToZba8KrrE83MmH3WP3qxv_ByGu8uQ" width="200" height="68"></span></span></p>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><strong><span style="color: rgb(0, 0, 0);font-size: 11pt;">Be extraordinary</span></strong></p>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><strong><span style="color: rgb(255, 0, 0);font-size: 11pt;">HO</span></strong><span style="color: rgb(0, 0, 0);font-size: 11pt;">&nbsp;Hanoi: 5th ﬂ., 71 Nguyen Chi Thanh st., Dong Da</span></p>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><span style="color: rgb(0, 0, 0);font-size: 11pt;">&nbsp; &nbsp; &nbsp; HCMC: 9th ﬂ., International Plaza Building, 343 Pham Ngu Lao, Dist. 1</span></p>
        </div>
        <p><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); vertical-align: baseline;">&nbsp;</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(255, 0, 0); font-weight: 700; vertical-align: baseline;">T</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); vertical-align: baseline;">&nbsp; +84 287717789 &nbsp;&nbsp;</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(255, 0, 0); font-weight: 700; vertical-align: baseline;">E</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); vertical-align: baseline;">&nbsp;</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(17, 85, 204); vertical-align: baseline;"><a href="mailto:contact@mindx.edu.vn" target="_blank" style="color: rgb(17, 85, 204);">contact@mindx.edu.vn</a></span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); vertical-align: baseline;">&nbsp;&nbsp;</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(255, 0, 0); font-weight: 700; vertical-align: baseline;">W</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); font-weight: 700; vertical-align: baseline;">&nbsp;&nbsp;</span><a href="http://mindx.edu.vn/" target="_blank" style="color: rgb(17, 85, 204); font-family: Arial, Helvetica, sans-serif; font-size: small; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="font-size: 11pt; font-family: Arial; background-color: transparent; vertical-align: baseline; white-space: pre-wrap;">mindx.edu.vn</span></a></p>
    </div>
</div>`: `
<p>Th&acirc;n gửi <strong>${name}</strong></p>
<p>Đ&atilde; c&oacute; lỗi trong qu&aacute; tr&igrave;nh nhập th&ocirc;ng tin của bạn, vui l&ograve;ng li&ecirc;n hệ người hướng dẫn được được giải quyết</p>
<p>Th&ocirc;ng tin người hướng dẫn</p>
<ul>
    <li>Nguyễn Văn Cường</li>
    <li>Zalo, Tele, Phone: 0822666664</li>
    <li>Facebook :&nbsp;<a data-fr-linked="true" href="https://www.facebook.com/nguyencuong21520/">https://www.facebook.com/nguyencuong21520/</a></li>
</ul>
<style type="text/css">
    p.p1 {
        margin: 0.0px 0.0px 0.0px 0.0px;
        line-height: 18.0px;
        font: 15.0px 'Helvetica Neue';
        color: #000000
    }

    span.s1 {
        text-decoration: underline
    }
</style>
<div style="text-align: start;color: rgb(34, 34, 34);font-size: small;">
    <div>
        <div>
            <div>
                <div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div>
                                        <div>
                                            <div>
                                                <div>
                                                    <div>
                                                        <div>
                                                            <div>
                                                                <div>
                                                                    <div>
                                                                        <div>
                                                                            <div>
                                                                                <div>
                                                                                    <p style="text-align: justify;"><br></p>
                                                                                    <p style="text-align: justify;">--</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div style="text-align: start;color: rgb(34, 34, 34);font-size: small;">
    <div>
        <div>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><span style="font-size: 14.6667px;"><strong>Teaching K18 Team</strong></span></p>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><strong><span style="color: rgb(0, 0, 0);font-size: 11pt;">M</span></strong><span style="color: rgb(0, 0, 0);font-size: 11pt;">&nbsp; +08 226666 64 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><strong><span style="color: rgb(0, 0, 0);font-size: 11pt;">E <span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(17, 85, 204); vertical-align: baseline;">teachingk18@mindx.edu.vn</span></span></strong><span style="color: rgb(0, 0, 0);font-size: 11pt;">&nbsp;</span><span style="color: transparent;font-size: 11pt;">teac</span></p>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><span style="color: transparent;font-size: 11pt;">--------------------------</span></p>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><span style="color: transparent;font-size: 11pt;"><span style="border: none;"><img src="https://lh5.googleusercontent.com/UkuiNxSmurwHEqrReNmuJZJvyFHdqx5n2CcJMMhff1J-dww0itwlnwRQM_RWCvCYFWZ7hw20r96X5dJ1WilIxyCdWQr9HVeKn9YM7E3dSq28_NG-9FH86SGVVEC5qLrHLbUzV7LWz8LRb0_RVBfjvErkG0mFU3IVToZba8KrrE83MmH3WP3qxv_ByGu8uQ" width="200" height="68"></span></span></p>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><strong><span style="color: rgb(0, 0, 0);font-size: 11pt;">Be extraordinary</span></strong></p>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><strong><span style="color: rgb(255, 0, 0);font-size: 11pt;">HO</span></strong><span style="color: rgb(0, 0, 0);font-size: 11pt;">&nbsp;Hanoi: 5th ﬂ., 71 Nguyen Chi Thanh st., Dong Da</span></p>
            <p style="text-align: start;color: rgb(34, 34, 34);background-color: rgb(255, 255, 255);font-size: small;"><span style="color: rgb(0, 0, 0);font-size: 11pt;">&nbsp; &nbsp; &nbsp; HCMC: 9th ﬂ., International Plaza Building, 343 Pham Ngu Lao, Dist. 1</span></p>
        </div>
        <p><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); vertical-align: baseline;">&nbsp;</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(255, 0, 0); font-weight: 700; vertical-align: baseline;">T</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); vertical-align: baseline;">&nbsp; +84 287717789 &nbsp;&nbsp;</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(255, 0, 0); font-weight: 700; vertical-align: baseline;">E</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); vertical-align: baseline;">&nbsp;</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(17, 85, 204); vertical-align: baseline;"><a href="mailto:contact@mindx.edu.vn" target="_blank" style="color: rgb(17, 85, 204);">contact@mindx.edu.vn</a></span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); vertical-align: baseline;">&nbsp;&nbsp;</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(255, 0, 0); font-weight: 700; vertical-align: baseline;">W</span><span style="font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: pre-wrap; background-color: transparent; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 11pt; font-family: Arial; color: rgb(0, 0, 0); font-weight: 700; vertical-align: baseline;">&nbsp;&nbsp;</span><a href="http://mindx.edu.vn/" target="_blank" style="color: rgb(17, 85, 204); font-family: Arial, Helvetica, sans-serif; font-size: small; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255);"><span style="font-size: 11pt; font-family: Arial; background-color: transparent; vertical-align: baseline; white-space: pre-wrap;">mindx.edu.vn</span></a></p>
    </div>
</div>
`
}
export {
    genRandomId,
    getProjection,
    resClientData,
    generateJWT,
    verifyJWT,
    verifyPassword,
    getDateOfWeekday,
    getWeekDay,
    formatDateToString,
    getProjectionByString,
    returnNumberBoolean,
    formatDateTime,
    getOrderWeekday,
    getScoreLevelTech,
    getScoreResourceApply,
    getScoreEducation,
    mailNotifiFillFormOnboard
};