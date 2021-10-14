import { Router, Request, Response } from 'express';
import dayjs from 'dayjs';
import checkLogin from '../middlewares/checkLogin';
import checkAdmin from '../middlewares/checkAdmin';
import SearchLog from '../models/SearchLog.model';
import UserController from '../controllers/User.controller';

const router = Router();

router.use(checkLogin);
router.use(checkAdmin);
router.get('/:id/:page?', async (req: Request, res: Response) => {
    let perPage = 100,
        max = 7,
        page = req.params.page ?? 1,
        user = await UserController.FindUser(req.params.id),
        total = await SearchLog.countDocuments({ user: user._id }),
        start = +page,
        end = Math.ceil(total / perPage),
        prev = start > 1 ? start - 1 : 1,
        next = start + 1 < end ? start + 1 : end,
        rest = Math.floor(max / 2),
        searchLogs = await SearchLog
            .find({ user: user._id })
            .sort({ date: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage);

    if (end < 1) {
        end = 1;
    }

    res.render('logs', {
        dayjs,
        id: req.params.id,
        searchLogs,
        start,
        end,
        prev,
        next,
        rest,
        max
    });
});

export default router;
