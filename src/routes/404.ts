import { Router, Request, Response } from 'express';

const router = Router();

router.use((req: Request, res: Response) => {
    res.status(404);
    res.render('404');
});

export default router;
