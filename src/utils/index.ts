import { Response } from 'express';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { JwtVerify, Obj } from '../global/interface';

const genRandomId = () => {
    return uuidv4()
};

const getProjection = (...fields: Array<string>) => {
    if (fields !== undefined) {
        const filedsProjection: Obj = {};
        fields.forEach((item) => {
            filedsProjection[item] = 1
        });
        return filedsProjection
    }
    return {}
}
function resClientData(res: Response, statusCode: number, data: any, message?: string) {
    res.status(statusCode).send({
        data,
        message,
        status: data ? true : false
    })
}
function generateJWT(data: Obj) {
    const token = jwt.sign(data, process.env.PRIVATE_KEY_JWT as string, {
        expiresIn: 60 * Number(process.env.JWT_EXPRISE),
    });
    return { token: token };
}
function verifyJWT(token: string): JwtVerify | string {
    try {
        const verifyToken = jwt.verify(token, process.env.PRIVATE_KEY_JWT as string, (err, data) => {
            if (data) return data;
            if (err) return err.message;
        });
        return verifyToken as unknown as JwtVerify;
    } catch (error: any) {
        return "jwt " + error.message
    }
}

export const encryptPassword = (password: string, saltUser?: string) => {
    // Private key for single user
    const salt = saltUser ?? crypto.randomBytes(128).toString("hex");
    // Hashed password
    const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");

    return {
        salt: salt,
        hashedPassword: hashedPassword,
    };
};

const verifyPassword = (password: string, acc: Obj) => {
    const hashedPassword = crypto
        .pbkdf2Sync(password, acc?.salt as string, 10000, 64, "sha512")
        .toString("hex");
    return hashedPassword === acc.password;
}
export {
    genRandomId,
    getProjection,
    resClientData,
    generateJWT,
    verifyJWT,
    verifyPassword
};