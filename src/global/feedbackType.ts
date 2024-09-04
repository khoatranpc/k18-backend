export interface TeacherRegister {
    _id: string;
    fullName: string;
    roleRegister: string;
    location?: {
        _id: string;
        locationName: string;
        locationCode: string;
    } | null;
}

export interface CourseLevel {
    levelCode: string;
    levelNumber: number;
}

export interface FinalResult {
    courseName: string;
    codeClassId: string | undefined;
    className: string;
    courseLevel: CourseLevel;
    time: number;
    bu: string;
    cxo: string;
    dayRange: {
        start: Date;
        end: Date;
    };
    status: string;
    teacherRegister: TeacherRegister[];
}