import { Router, Request, Response } from 'express';
import dayjs from 'dayjs';
import Word from '../models/Word.model';
import SearchLog from '../models/SearchLog.model';
import UserController from '../controllers/User.controller';

const router = Router();

router.get('/:id', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(400).send({ message: '로그인 후 이용가능합니다!' });
    }

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
