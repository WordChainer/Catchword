import { Router, Request, Response } from 'express';
import dayjs from 'dayjs';
import EditLogController from '../controllers/EditLog.controller';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(400).send('로그인 후 이용가능합니다!');
    }

    res.render('history', {
        dayjs,
        editLogs: await EditLogController.GetAllEditLogs()
    });
});

export default router;
