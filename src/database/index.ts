export enum Collections {
    ACCOUNT = 'accounts',
    COURSE = 'courses',
    COURSELEVEL = 'courselevels',
    TIMESCHEDULE = 'timeschedules',
    CLASS = 'classes',
    LOCATION = 'locations',
    BOOKTEACHER = 'bookteachers',
    PRETEACHER = 'preteachers',
    TEACHER = 'teachers',
    TEACHERREGISTERCOURSE = 'teacherregistercourses',
    TEACHERSCHEDULE = 'teacherschedules',
    CLASSSESSION = 'classsessions',
    FEEDBACK = 'feedbacks'
}
const getUri = () => {
    const { MONGO_CLIENT, MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, DB_NAME } = process.env;
    const AUTH_DB = MONGO_USERNAME && MONGO_PASSWORD ? `${MONGO_USERNAME}:${MONGO_PASSWORD}@` : '';
    // const uri = `${MONGO_CLIENT}://${AUTH_DB}${MONGO_HOST}:${MONGO_PORT}/${DB_NAME}`;
    // const uri = `mongodb+srv://cuongnv:UCENc4FEl5ht0jW4@mindxdev.dmpv4mn.mongodb.net/mindx-k18`
    const uri = process.env.DB_CLOUD as string;
    return uri;
}
export default getUri;