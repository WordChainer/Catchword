import { Router, Request, Response } from 'express';
import moment from 'moment';
import checkAdmin from '../utils/checkAdmin';
import User from '../models/User.model';
import SearchLog from '../models/SearchLog.model';

const router = Router();

router.all('*', checkAdmin);
router.get('/', async (req: Request, res: Response) => {
    let users = await User.find().sort({ date: 1 }),
        searchCounts = await SearchLog.aggregate([
            { $group: { _id: '$user',  count: { $sum: 1 } } }
        ]);

    res.render('manage', {
        moment,
        users,
        searchCounts
    });
});

export default router;
