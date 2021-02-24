import { Router, Request, Response } from 'express';
import Word from '../models/Word.model';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    let ranks = await Word.aggregate([
        {
            $group: {
                _id: '$user',
                count: { $sum: 1 }
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
                count: 1
            }
        },
        {
            $sort: {
                count: -1,
                user: 1
            }
        }
    ]);

    res.render('leaderboard', { ranks });
});

export default router;
