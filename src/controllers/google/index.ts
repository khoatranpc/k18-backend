import { Request, Response } from "express";
import { RequestMid } from "../../middlewares";
import Google from "../../google";
import { ROLE } from "../../global/enum";
import { resClientData } from "../../utils";

const googleControler = {
    auth: (req: RequestMid, res: Response) => {
        try {
            const url = Google.generateAuthUrl(req.acc?.role as ROLE);
            resClientData(req, res, 200, {
                url,
            });
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    redirect: (req: Request, res: Response) => {
        try {
            const { code } = req.query;
            if (!code) throw new Error('Code is required!');
            Google.setCredentails(code as string);
            resClientData(req, res, 202, {}, 'Đăng nhập Google thành công!');
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    },
    getCalendars: (req: Request, res: Response) => {
        try {
            const { calendarId } = req.query;
            const calendars = Google.getCalendars(calendarId as string);
            resClientData(req, res, 200, calendars);
        } catch (error: any) {
            resClientData(req, res, 403, null, error.message);
        }
    }
}

export default googleControler;