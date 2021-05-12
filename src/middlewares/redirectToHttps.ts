import Const from '../const.json';
import { Request, Response, NextFunction } from 'express';

export default async function redirectoHttps(req: Request, res: Response, next: NextFunction) {
    if (Const.IS_SECURED && !req.secure) {
        let url = 'https://' + req.headers.host + req.url;

        return res.status(302).redirect(url);
    }

    next();
}
