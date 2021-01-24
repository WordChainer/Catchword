import { Router, Request, Response } from 'express';
import moment from 'moment';
import User from '../models/User.model';
import SearchLog from '../models/SearchLog.model';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    if (!res.locals.isAdmin) {
        return res.send('접근 권한이 없습니다!');
    }

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
