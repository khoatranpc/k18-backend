import { NextFunction, Response, Request } from "express";
import { JwtVerify } from "../global/interface";
import { ROLE } from "../global/enum";
import { resClientData, verifyJWT } from "../utils";


export interface RequestMid extends Request {
    acc?: {
        role: ROLE,
        id: string,
        token: string
    }
}
const middlewares = {
    verifyJWT: (req: RequestMid, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) throw new Error('UnAuthorization!');
            const token = authHeader.split(' ')[1];
            const verify = verifyJWT(token);
            if (verify === 'jwt expired') throw new Error('token expired!');
            if (verify === 'invalid token') throw new Error('UnAuthorization!');
            req.acc = {
                role: (verify as JwtVerify).role as ROLE,
                id: (verify as JwtVerify).accId as string,
                token: token,
            }
            next();
        } catch (error: any) {
            resClientData(res, 401, undefined, error.message);
        }
    },
    isTE: (req: RequestMid, res: Response, next: NextFunction) => {
        try {
            const crrRole = req.acc;
            if (crrRole?.role !== ROLE.TE) throw new Error('Bạn không thể thực hiện hành động!');
            next();
        } catch (error: any) {
            resClientData(res, 403, undefined, error.message);
        }
    },
    delete_IdFromBody: (req: RequestMid, res: Response, next: NextFunction) => {
        try {
            const { _id } = req.body;
            if (_id) throw new Error('Bạn không được phép gửi _id trong request!');
            next();
        } catch (error: any) {
            resClientData(res, 500, undefined, error.message);
        }
    }
}
export default middlewares;