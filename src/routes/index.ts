import { Router, Request, Response } from 'express';
import glob from 'fast-glob';
import Word from '../models/Word.model';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    let slides = await glob('images/slide*.jpg', { cwd: 'public' });
    let counts = await Promise.all([
        Word.countDocuments({}),
        Word.countDocuments({ isHidden: true }),
        Word.countDocuments({ length: 3 }),
        Word.countDocuments({ length: 2 })
    ]);

    res.render('index', { slides, counts });
});

export default router;
