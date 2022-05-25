import { Router, Request, Response } from 'express';
import Logger from '../utils/Logger';

const router = Router();
const logger = new Logger();

router.get('/', (req: Request, res: Response) => {
    req.session.destroy(() => {
        logger.error(`Logout: ${req.user.nickname}`);
        req.logout(() => {
            res.redirect('/');
        });
    });
});

export default router;
