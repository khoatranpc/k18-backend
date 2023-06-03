import * as yup from 'yup';
import { NextFunction, Request, Response } from 'express';
const validate = (schema: yup.Schema, httpCode?: number) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params
        });
        return next();
    } catch (err: any) {
        return res.status(httpCode || 500).json({ type: err.name, message: err.message, data: null, status: false });
    }
};
export { validate };