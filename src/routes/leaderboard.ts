import { Router, Request, Response } from 'express';
import Word from '../models/Word.model';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    let ranks = await Word.aggregate([
        {
            $match: {
                date: { $gte: new Date("2020-12-22T00:00:00.000Z") }
            }
        },
        {
            $group: {
                _id: '$user',
                count33: {
                    $sum: {
                        $cond: [{ '$eq': ['$length', 3] }, 1, 0]
                    }
                },
                count32: {
                    $sum: {
                        $cond: [{ '$eq': ['$length', 2] }, 1, 0]
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                user: '$user.nickname',
                profile: '$user.profile_image',
                _id: 0,
                count: { $add: ['$count33', '$count32'] },
                count33: 1,
                count32: 1
            }
        },
        {
            $sort: {
                count: -1,
                count33: -1,
                user: 1
            }
        }
    ]);

    res.render('leaderboard', { ranks });
});

export default router;
