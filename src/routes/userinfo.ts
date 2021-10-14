import { Router, Request, Response } from 'express';
import checkLogin from '../middlewares/checkLogin';
import Word from '../models/Word.model';
import SearchLog from '../models/SearchLog.model';
import UserController from '../controllers/User.controller';
import dayjs from 'dayjs';

const router = Router();

router.use(checkLogin);
router.get('/:id', async (req: Request, res: Response) => {
    if (!res.locals.isAdmin && req.user.id !== req.params.id) {
        return res.send('접근 권한이 없습니다!');
    }

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
                    list: {
                        $push: {
                            value: '$value',
                            isHidden: '$isHidden',
                            date: '$date'
                        }
                    }
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
