import { Router } from "express";
import middlewares from "../middlewares";
import { ROLE } from "../global/enum";
import googleControler from "../controllers/google";

const GoogleRouter = Router();

GoogleRouter.get('/auth', middlewares.verifyJWT, middlewares.acceptRole(undefined, ROLE.TE), googleControler.auth);
GoogleRouter.get('/redirect', middlewares.verifyJWT, middlewares.acceptRole(undefined, ROLE.TE), googleControler.redirect);
GoogleRouter.get('/calendars', middlewares.verifyJWT, middlewares.acceptRole(undefined, ROLE.TE), googleControler.getCalendars);

export default GoogleRouter;