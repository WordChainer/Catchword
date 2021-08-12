import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/Logger';

const logger = new Logger();

export default async function logRequests(req: Request, res: Response, next: NextFunction) {
    let method = req.method,
        url = req.url,
        status = res.statusCode,
        user = req.user.nickname,
        ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    logger.log(`${method}: ${user}(${ip}) ${url} ${status}`);

    next();
}
