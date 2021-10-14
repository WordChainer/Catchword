import { Request, Response, NextFunction } from 'express';

export default function checkLogin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(400).send({ message: '로그인 후 이용가능합니다!' });
    }

    next();
}
