import { Request, Response, NextFunction } from 'express';

export default function checkAdmin(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.isAdmin) {
        return res.send('권한이 없습니다.');
    }

    next();
}
