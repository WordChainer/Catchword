import { Request, Response, NextFunction } from 'express';
import UserController from '../controllers/User.controller';

export default async function setLocals(req: Request, res: Response, next: NextFunction) {
    res.locals.session = req.session;
    res.locals.path = req.path;

    if (req.session.passport) {
        let user = await UserController.FindUser(req.user.id);

        res.locals.isAdmin = user.isAdmin;
    }

    next();
}
