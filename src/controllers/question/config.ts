import { ObjectId } from "mongodb";
import { Obj } from "../../global/interface";

const createListQuestionAndOption = (listQuestion: Obj[]) => {
    const questions: Obj[] = [];
    const options: Obj[] = [];
    (listQuestion as Obj[])?.map((item) => {
        const createIdQuestion = new ObjectId();
        const getItemQuestion: Obj = {
            ...item,
            _id: item._id ?? createIdQuestion
        };
        (getItemQuestion?.options as Obj[])?.forEach(option => {
            const getOption = {
                ...option,
                questionId: getItemQuestion._id,
                type: getItemQuestion.type,
                _id: option._id ?? new ObjectId()
            };
            options.push(getOption)
        })
        questions.push(getItemQuestion);
    });
    return {
        questions,
        options
    }
}
export {
    createListQuestionAndOption
}