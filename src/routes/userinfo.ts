import { Router, Request, Response } from 'express';
import dayjs from 'dayjs';
import checkAdmin from '../utils/checkAdmin';
import Word from '../models/Word.model';
import SearchLog from '../models/SearchLog.model';
import UserController from '../controllers/User.controller';

const router = Router();

router.all('*', checkAdmin);
router.get('/:id', async (req: Request, res: Response) => {
    let target = await UserController.FindUser(req.params.id),
        searchCount = await SearchLog.countDocuments({ user: target._id }),
        words = await Word.aggregate([
            {
                $match: {
                    date: { $gte: new Date("2020-12-22T00:00:00.000Z") },
                    user: target._id
                }
            },
            {
                $group: {
                    _id: '$length',
                    list: { $push: '$value' }
                }
            }
        ]);

    res.render('userinfo', {
        dayjs,
        target,
        searchCount,
        words
    });
});

export default router;
