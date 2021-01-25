import { Router, Request, Response } from 'express';
import moment from 'moment';
import checkAdmin from '../utils/checkAdmin';
import SearchLog from '../models/SearchLog.model';
import UserController from '../controllers/User.controller';

const router = Router();

router.all('*', checkAdmin);
router.get('/:id/:page?', async (req: Request, res: Response) => {
    let perPage = 100;
    let page = req.params.page ?? 1,
        user = await UserController.FindUser(req.params.id),
        total = await SearchLog.countDocuments({ user: user._id }),
        searchLogs = await SearchLog
            .find({ user: user._id })
            .sort({ date: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage);

    res.render('logs', {
        moment,
        id: req.params.id,
        current: +page,
        total,
        perPage,
        searchLogs
    });
});

export default router;
