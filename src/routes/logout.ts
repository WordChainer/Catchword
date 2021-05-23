import { Router, Request, Response } from 'express';
import formatDate from '../utils/formatDate';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    req.session.destroy(() => {
        let date = formatDate('HH:mm:ss');

        console.log('\x1b[41m', `[${date}] Logout: ${req.user.nickname}`, '\x1b[0m');
        req.logout();
        res.redirect('/');
    });
});

export default router;
