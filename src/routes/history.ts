import { Router, Request, Response } from 'express';
import dayjs from 'dayjs';
import EditLogController from '../controllers/EditLog.controller';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.render('history', {
        dayjs,
        editLogs: await EditLogController.GetAllEditLogs()
    });
});

export default router;
