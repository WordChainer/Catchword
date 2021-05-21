import { Router, Request, Response } from 'express';
import glob from 'fast-glob';
import User from '../models/User.model';
import Word from '../models/Word.model';
import SearchLog from '../models/SearchLog.model';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    let slides = await glob('images/slide*.jpg', { cwd: 'public' });
    let sample = await Word.aggregate([
        { $match: { isHidden: false } },
        { $sample: { size: 1 } }
    ]);
    let contents = await Promise.all([
        Word.countDocuments(),
        User.countDocuments(),
        SearchLog.countDocuments(),
        sample[0].value
    ]);

    res.render('index', { slides, contents });
});

export default router;
