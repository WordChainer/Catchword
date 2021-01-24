import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    req.session.destroy(() => {
        req.logout();
        res.redirect('/');              
    });
});

export default router;
