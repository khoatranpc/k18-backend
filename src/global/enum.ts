export enum ROLE {
    TEACHER = 'TEACHER',
    TE = 'TE',
    CXO = 'CXO',
    CS = 'CS'
}

export enum STATUS {
    AT = 'ACTIVE',
    DT = 'DEACTIVE',
    PD = 'PENDING',
    RJ = 'REJECT'
}

export enum GENDER {
    M = "MALE",
    FM = "FEMALE",
    NA = "NA"
}
export enum WEEKDAY {
    T2 = 'T2',
    T3 = 'T3',
    T4 = 'T4',
    T5 = 'T5',
    T6 = 'T6',
    T7 = 'T7',
    CN = 'CN',
}
export enum STATUS_CLASS {
    RUNNING = 'RUNNING',
    PREOPEN = 'PREOPEN',
    DROP = 'DROP',
    FINISH = 'FINISH'
}
export enum ROLE_TEACHER {
    SP = 'SP',
    MT = 'MT',
    ST = 'ST'
}
export enum ClassForm {
    HYBRID = 'HYBRID',
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
}
export enum ObjectTeach {
    K18 = 'K18',
    K12 = 'K12'
}
export enum StatusProcessing {
    // no process
    NOPROCESS = 'NOPROCESS',
    // processing
    PROCESSING = 'PROCESSING',
    // DONE
    DONE = 'DONE'
}
export enum ResourceApply {
    FB = 'FB',
    LKD = 'LKD',
    RF = 'RF',
    AN = 'AN',
    TCV = 'TCV'
}
export enum ResultInterview {
    PASS = 'PASS',
    NOTPASS = 'NOTPASS',
    PENDING = 'PENDING'
}
export enum LevelTechnique {
    INTERN = 'INTERN',
    FRESHER = 'FRESHER',
    JUNIOR = 'JUNIOR',
    MIDDLE = 'MIDDLE',
    SENIOR = 'SENIOR',
    LEADER = 'LEADER'
}
export enum Education {
    BACHELOR = 'BACHELOR',
    ENGINEER = 'ENGINEER',
    // thạc sĩ
    MASTER = 'MASTER',
    // tiến sĩ
    DOCTOR = 'DOCTOR'
}
export enum RoundProcess {
    FILLFORM = 'FILLFORM',
    CV = 'CV',
    INTERVIEW = 'INTERVIEW',
    CLAUTID = 'CLAUTID',
    TEST = 'TEST',
    DONE = 'DONE',
    CLASSIFY = 'CLASSIFY'
}
export enum PositionTe {
    LEADER = 'LEADER',
    ASSISTANT = 'ASSISTANT',
    QC = 'QC',
    HR = 'HR'
}
export enum TemplateMail {
    FAILCV = 'FAILCV',
    FAILINTERVIEW = 'FAILINTERVIEW',
    PASSINTERVIEW = 'PASSINTERVIEW',
    NOCONNECT = 'NOCONNECT',
    INVITEINTERVIEW = 'INVITEINTERVIEW',
    NOTI_RECEIVED_CV = 'NOTI_RECEIVED_CV',
    PENDING = 'PENDING'
}
export enum Area {
    HN = 'HN',
    HCM = 'HCM',
    DN = 'DN',
    ONL = 'ONL',
    ANT = 'ANT'
}
export enum Region {
    MB = 'MB',
    MT = 'MT',
    MN = 'MN',
    ONL = 'ONL'
}

export enum RoomSocket {
    COMMON = 'COMMON'
}

export enum TypeQuestion {
    QUIZ = 'QUIZ',
    BOOLEAN = 'BOOLEAN'
}

export enum TeachingDepartment {
    K18 = 'K18',
    K12 = 'K12'
}

export enum PositionCs {
    LEADER = 'LEADER',
    EXECUTIVE = 'EXECUTIVE'
}