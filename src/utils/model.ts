import mongoose from "mongoose";
import { Obj } from "../global/interface";
import { Collections } from "../database";

const createModel = (collection: keyof typeof Collections, schema: Obj, options?: Obj) => {
    const docSchema = new mongoose.Schema(schema, options);
    const model = mongoose.model(Collections[collection], docSchema);
    return model;
}
export { createModel }