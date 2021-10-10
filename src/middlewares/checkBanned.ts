import { Request, Response, NextFunction } from 'express';

export default function checkBanned(req: Request, res: Response, next: NextFunction) {
    if (res.locals.isBanned) {
        return res.render('banned');
    }

    next();
}
