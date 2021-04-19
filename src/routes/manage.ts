import { Router, Request, Response } from 'express';
import dayjs from 'dayjs';
import checkAdmin from '../utils/checkAdmin';
import User from '../models/User.model';
import SearchLog from '../models/SearchLog.model';

const router = Router();

router.all('*', checkAdmin);
router.get('/', async (req: Request, res: Response) => {
    let users = await User.find().sort({ isAdmin: -1, date: 1 }),
        searchCounts = await SearchLog.aggregate([
            { $group: { _id: '$user',  count: { $sum: 1 } } }
        ]);

    res.render('manage', {
        dayjs,
        users,
        searchCounts
    });
});

export default router;
