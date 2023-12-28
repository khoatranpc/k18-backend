import { ROLE } from "../../global/enum";
import { createModel } from "../../utils/model";

const DocumentModel = createModel('DOCUMENT', {
    docTitle: {
        type: String,
        required: true
    },
    docDescribe: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    linkDoc: {
        type: String,
        default: ''
    },
    role: [
        {
            type: String,
            enum: ROLE
        }
    ]
}, {
    timestamps: true
});
export default DocumentModel;