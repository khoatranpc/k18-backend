import { NextFunction, Response, Request } from "express";
import { JwtVerify } from "../global/interface";
import { PositionTe, ROLE } from "../global/enum";
import { resClientData, verifyJWT } from "../utils";


export interface RequestMid extends Request {
    acc?: {
        role: ROLE | string,
        id: string,
        token: string,
        position?: PositionTe,
        userId?: string
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
                position: (verify as JwtVerify).position,
                userId: (verify as JwtVerify).userId
            }
            next();
        } catch (error: any) {
            resClientData(req, res, 401, undefined, error.message);
        }
    },
    verifyJWTnotRequired: (req: RequestMid, _: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        const token = String(authHeader).split(' ')[1];
        const verify = verifyJWT(token);
        if (!authHeader || (authHeader && (verify === 'jwt expired' || verify === 'invalid token'))) {
            req.acc = {
                id: "",
                role: "",
                token: "",
            }
            return next();
        } else {
            req.acc = {
                role: (verify as JwtVerify).role as ROLE,
                id: (verify as JwtVerify).accId as string,
                token: token,
                position: (verify as JwtVerify).position,
                userId: (verify as JwtVerify).userId
            }
            return next();
        }
    },
    isTE: (req: RequestMid, res: Response, next: NextFunction) => {
        try {
            const crrRole = req.acc;
            if (crrRole?.role !== ROLE.TE) throw new Error('Bạn không thể thực hiện hành động!');
            next();
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    isTeacher: (req: RequestMid, res: Response, next: NextFunction) => {
        try {
            const crrRole = req.acc;
            if (crrRole?.role !== ROLE.TEACHER) throw new Error('Bạn không thể thực hiện hành động!');
            next();
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    delete_IdFromBody: (req: RequestMid, res: Response, next: NextFunction) => {
        try {
            const { _id } = req.body;
            if (_id) throw new Error('Bạn không được phép gửi _id trong request!');
            next();
        } catch (error: any) {
            resClientData(req, res, 500, undefined, error.message);
        }
    },
    acceptRole: (rolePosition?: PositionTe, ...roleAccountAccept: ROLE[]) => {
        return (req: RequestMid, res: Response, next: NextFunction) => {
            try {
                const crrRole = req.acc;
                if (rolePosition) {
                    if (crrRole?.position !== rolePosition) throw new Error('Bạn không thể thực hiện hành động!');
                } else {
                    if (!roleAccountAccept.includes(crrRole?.role as ROLE)) throw new Error('Bạn không thể thực hiện hành động!');
                }
                next();
            } catch (error: any) {
                resClientData(req, res, 403, undefined, error.message);
            }
        }
    },
    checkEqualIdForUpdate: async (req: RequestMid, res: Response, next: NextFunction) => {
        try {
            const crrRole = req.acc?.role;
            const { id } = req.params;
            if (crrRole === ROLE.TE && req.acc?.position === PositionTe.LEADER) {
                return next();
            } else {
                if (req.acc?.userId === id) return next();
                else throw new Error("Bạn không thể thực hiện hành động!");
            }
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    },
    uploadFileImage: (req: Request, res: Response, next: NextFunction) => {
        try {
            const { image, imageName } = req.body;
            if (!image || !imageName) throw new Error("Missing image or image name!");
            next();
        } catch (error: any) {
            resClientData(req, res, 403, undefined, error.message);
        }
    }
}
export default middlewares;