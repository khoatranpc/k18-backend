import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import csvParser from "csv-parser";
import { encryptPassword, getProjection, resClientData } from "../../utils";
import TeacherModel from "../../models/teacher";
import { RequestMid } from "../../middlewares";
import { ROLE, TeachingDepartment } from "../../global/enum";
import { Obj } from "../../global/interface";
import CourseModel from "../../models/course";
import CourseLevelModel from "../../models/courseLevel";
import { convertStringToDate, getKeyByValue, isValidDate, labelArea, labelGender, orderLevelCourse } from "./config";
import TeacherRegisterCourseModel from "../../models/teacherRegisterCourse";
import AreaModel from "../../models/area";
import AccountModel from "../../models/account";
import uploadToCloud from "../../utils/cloudinary";
import TeacherPointModel from "../../models/teacherPoint";

const teacherController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const { fields, recordOnPage, currentPage, listTeacherId, valueSearch } = req.query;
            let listTeacher;
            if (listTeacherId) {
                listTeacher = await TeacherModel.find({
                    _id: {
                        $in: listTeacherId
                    }
                }, { ...fields && getProjection(...fields as Array<string>) }).sort({
                    createdAt: -1
                });
            }
            else if (recordOnPage && currentPage) {
                listTeacher = await TeacherModel.find({
                    ...valueSearch ? {
                        '$or': [
                            {
                                email: {
                                    "$regex": valueSearch,
                                    "$options": "i"
                                }
                            },
                            {
                                fullName: {
                                    "$regex": valueSearch,
                                    "$options": "i"
                                }
                            }
                        ]
                    } : {}
                }, { ...fields && getProjection(...fields as Array<string>) }).sort({
                    createdAt: -1
                })
                    .skip((Number(recordOnPage) * Number(currentPage)) - Number(recordOnPage)).limit(Number(recordOnPage))
            } else {
                listTeacher = await TeacherModel.find({
                    ...valueSearch ? {
                        '$or': [
                            {
                                email: {
                                    "$regex": valueSearch,
                                    "$options": "i"
                                }
                            },
                            {
                                fullName: {
                                    "$regex": valueSearch,
                                    "$options": "i"
                                }
                            }
                        ]
                    } : {}
                }, { ...fields && getProjection(...fields as Array<string>) }).sort({
                    createdAt: -1
                });
            }
            const listTeacherLength = await TeacherModel.countDocuments({
                ...valueSearch ? {
                    '$or': [
                        {
                            email: {
                                "$regex": valueSearch,
                                "$options": "i"
                            }
                        },
                        {
                            fullName: {
                                "$regex": valueSearch,
                                "$options": "i"
                            }
                        }
                    ]
                } : {}
            }).sort({
                createdAt: -1
            });
            const dataSend = {
                listTeacher: listTeacher,
                totalPage: Math.ceil(listTeacherLength / Number(recordOnPage)),
                currentPage: Number(currentPage) || '',
                recordOnPage: Number(recordOnPage || '')
            }

            resClientData(req, res, 200, dataSend);
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
    getOne: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { fields } = req.query;
            const teacher = await TeacherModel.findById(id, { ...fields && getProjection(...fields as Array<string>) });
            if (!teacher) throw new Error('Không có thông tin giáo viên!');
            const findAllFeedbackResponse = await TeacherPointModel.find({
                teacherId: id
            });
            let teacherPointForTeacher = 0;
            findAllFeedbackResponse.forEach((item) => {
                teacherPointForTeacher += item.point;
            });
            const avgTC = (teacherPointForTeacher / findAllFeedbackResponse.length);
            if (teacher.teacherPoint !== avgTC && avgTC) {
                teacher.teacherPoint = avgTC;
                await teacher.save();
            }

            resClientData(req, res, 200, teacher);
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
    findByIdAndUpdate: async (req: RequestMid, res: Response) => {
        try {
            const { id } = req.params;
            const { frontId, backId }: any = req.files ? req.files : { frontId: null, backId: null };
            const data: Obj | any = {
                ...req.body
            };
            if (req.acc?.role === ROLE.TE) {
                if (frontId) {
                    const uploadFile = await uploadToCloud(frontId[0]);
                    data["frontId"] = uploadFile.secure_url;
                }
                if (backId) {
                    const uploadFile = await uploadToCloud(backId[0]);
                    data["backId"] = uploadFile.secure_url;
                }
                await TeacherModel.findByIdAndUpdate(id, data);
            } else if (req.acc?.role === ROLE.TEACHER) {
                delete data.salaryPH;
                const crrTeacher = await TeacherModel.findOne({ idAccount: req.acc?.id as string });
                if (!crrTeacher) throw new Error('Không tìm thấy giáo viên!');
                if (crrTeacher._id.toString() !== id) throw new Error('Bạn không có quyền thực hiện hành động!');
                if (frontId) {
                    const uploadFile = await uploadToCloud(frontId[0]);
                    data["frontId"] = uploadFile.secure_url;
                }
                if (backId) {
                    const uploadFile = await uploadToCloud(backId[0]);
                    data["backId"] = uploadFile.secure_url;
                }
                await TeacherModel.findByIdAndUpdate(id, {
                    ...data,
                    area: new ObjectId(JSON.parse(data['area'])).toString()
                }, { new: true });
            }
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    findByEmail: async (req: Request, res: Response) => {
        try {
            const { email, limit } = req.query;
            const getLimit: number = Number(limit) ? Number(limit) : 10;
            const listTeacher = await TeacherModel.find({
                email: {
                    "$regex": email as string,
                    "$options": "i"
                },
                isOffical: true
            }, {
                _id: 1,
                fullName: 1,
                email: 1
            }).limit(getLimit);
            resClientData(req, res, 200, listTeacher);
        } catch (error: any) {
            resClientData(req, res, 404, undefined, error.message);
        }
    },
    importCSV: async (req: Request, res: Response) => {
        try {
            const csvFile = req.file;
            const resultCSV: Obj[] = [];
            const resultsTeacherInfo: any[] = [];
            const recordRegisterCourses: any[] = [];
            const listAccount: any[] = [];
            if (!csvFile) throw new Error('Không có file CSV');
            const stringFile = csvFile.buffer.toString("utf-8");
            const existingEmails = await TeacherModel.distinct("email");
            const existingAccounts = await AccountModel.distinct("email");
            const existingTeacherRegisterCourse = await TeacherRegisterCourseModel.distinct("teacherEmail");

            csvParser({ headers: true })
                .on('data', (data) => {
                    resultCSV.push(data);
                })
                .write(stringFile);
            const getColumnTitles = (resultCSV[0]["_0"] as string).split(";");
            getColumnTitles.forEach((item, idx) => {
                getColumnTitles[idx] = item.replace(/[^a-zA-Z0-9]/g, '');
            });
            const getListCourse = await CourseModel.find({}, { _id: 1, courseName: 1 });
            const getListCourseLevel = await CourseLevelModel.find({}, { _id: 1, levelNumber: 1, courseId: 1 });
            const listArea = await AreaModel.find({});
            const areas: Obj = {};
            listArea.forEach((area) => {
                areas[area.code as string] = area._id;
            });
            const courseId: Obj = {};
            getListCourse.forEach((course) => {
                courseId[course.courseName] = course._id.toString()
            });
            for (let i = 1; i < resultCSV.length; i++) {
                const crrValueRow = resultCSV[i];
                let mapStringValue: string = '';
                for (const key in crrValueRow) {
                    mapStringValue += `${crrValueRow[key]}`;
                }
                const newValueRow: Obj = {
                    _id: new ObjectId()
                };
                const getValueRows = mapStringValue.split(";");
                for (let idx = 0; idx < getColumnTitles.length; idx++) {
                    const title = getColumnTitles[idx];
                    newValueRow[title] = getValueRows[idx];
                    if (title === 'email' && existingEmails.includes(newValueRow[title])) {
                        break;
                    }
                    if (title === 'linkCv') {
                        newValueRow['CVfile'] = newValueRow[title];
                    }
                    if (title === 'courseRegister') {
                        newValueRow[title] = String(newValueRow[title]).split(' ').filter((item => {
                            return courseId[item]
                        })).map((item) => courseId[item]);
                    }
                    if (title === 'levelCourse') {
                        newValueRow[title] = String(newValueRow[title]).split(' ').filter((item => {
                            return orderLevelCourse[item as keyof typeof orderLevelCourse]
                        })).map((item) => orderLevelCourse[item as keyof typeof orderLevelCourse]);
                    }
                    if (title === 'area') {
                        newValueRow['area'] = areas[getKeyByValue(labelArea, newValueRow['area']) ? getKeyByValue(labelArea, newValueRow['area']) as string : "Online"] ?? areas['Online'];
                    }
                    if (title === 'teachingDepartment') {
                        newValueRow[title] = [TeachingDepartment.K18];
                    }
                    if (title === 'gender') {
                        newValueRow['gender'] = getKeyByValue(labelGender, newValueRow['gender'] as keyof typeof labelGender);
                    }
                    if (title === 'dateStartWork') {
                        const getDate = isValidDate(newValueRow[title] as string);
                        if (getDate) {
                            newValueRow[title] = new Date(newValueRow[title] as string);
                        } else {
                            newValueRow[title] = new Date();
                        }
                    }
                    if (title === 'licenseDate' || title === 'dob') {
                        newValueRow[title] = convertStringToDate(newValueRow[title] as string);
                    }
                    if (title === 'role') {
                        if (String(newValueRow[title]).includes("Giáo viên")) {
                            newValueRow.roleIsST = true;
                        }
                        if (String(newValueRow[title]).includes("Mentor")) {
                            newValueRow.roleIsMT = true;
                        }
                        if (String(newValueRow[title]).includes("Supporter")) {
                            newValueRow.roleIsSP = true;
                        }
                    }
                    if (title === 'Status' && newValueRow["Status"] === "Active") {
                        newValueRow.isOffical = true;
                    } else {
                        newValueRow.isOffical = false;
                    }
                }
                if (newValueRow.email && !existingEmails.includes(newValueRow['email'])) {
                    resultsTeacherInfo.push(newValueRow);
                }
            }
            resultsTeacherInfo.map((teacher, idx) => {
                const { salt, hashedPassword } = encryptPassword(teacher['email']);
                if (!existingAccounts.includes(teacher['email'])) {
                    const account = {
                        email: teacher['email'],
                        salt,
                        password: hashedPassword,
                        role: ROLE.TEACHER,
                        activate: true,
                        _id: new ObjectId()
                    };
                    resultsTeacherInfo[idx].idAccount = account._id;
                    listAccount.push(account);
                }
                const courseRegister = teacher['courseRegister'][0] as string;
                if (!existingTeacherRegisterCourse.includes(teacher.email)) {
                    if (!courseRegister) {
                        const newRecordRegisterCourse = {
                            idTeacher: teacher._id,
                            coursesRegister: [],
                            teacherEmail: teacher.email
                        };
                        recordRegisterCourses.push(newRecordRegisterCourse);
                    } else {
                        const listLevel = getListCourseLevel.filter((level) => {
                            return (teacher['levelCourse'] as number[]).some(value => value === level.levelNumber) && level.courseId.toString() === courseRegister && courseRegister;
                        }).map(item => item._id.toString());
                        if (!listLevel.length) {
                            const newRecordRegisterCourse = {
                                idTeacher: teacher._id,
                                coursesRegister: [],
                                teacherEmail: teacher.email
                            };
                            recordRegisterCourses.push(newRecordRegisterCourse);
                        } else {
                            const recordRegisterCourse = {
                                idTeacher: teacher._id,
                                coursesRegister: [
                                    {
                                        idCourse: courseRegister,
                                        levelHandle: listLevel,
                                    }
                                ],
                                teacherEmail: teacher.email
                            };
                            recordRegisterCourses.push(recordRegisterCourse);
                        }
                    }
                }
            });
            await Promise.all([
                TeacherModel.insertMany(resultsTeacherInfo, { ordered: false }),
                TeacherRegisterCourseModel.insertMany(recordRegisterCourses, { ordered: false }),
                AccountModel.insertMany(listAccount, { ordered: false }),
            ]);
            resClientData(req, res, 201, {});
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const { email, fullName, facebookLink, roles, phoneNumber, coursesRegister } = req.body;

            const existingAccounts = await AccountModel.findOne({ email });
            const { salt, hashedPassword } = encryptPassword(email);

            if (existingAccounts) return resClientData(req, res, 409, null, "Email already exists.");
            const acount = await AccountModel.create({
                email,
                salt,
                password: hashedPassword,
                role: ROLE.TEACHER,
                activate: true,
                _id: new ObjectId()
            });
            const newTeacher = await TeacherModel.create({
                idAccount: acount._id,
                isOffical: true,
                email,
                phoneNumber,
                fullName,
                facebookLink,
                roleIsST: roles.includes("ST"),
                roleIsMT: roles.includes("MT"),
                roleIsSP: roles.includes("SP"),
            })

            const newTeacherRegisterCourse = await TeacherRegisterCourseModel.create({
                idTeacher: newTeacher._id,
                teacherEmail: email,
                coursesRegister
            })
            resClientData(req, res, 200, { existingAccounts, newTeacher, newTeacherRegisterCourse }, "success");


        } catch (error: any) {
            resClientData(req, res, 404, undefined, error.message);

        }

    }
}
export default teacherController;