import { Router, Request, Response } from 'express';
import dayjs from 'dayjs';
import checkAdmin from '../middlewares/checkAdmin';
import User from '../models/User.model';

const router = Router();

router.use(checkAdmin);
router.get('/', async (req: Request, res: Response) => {
    let users = await User.find().sort({ isAdmin: -1, date: 1 });

    res.render('manage', {
        dayjs,
        users
    });
});

export default router;
