import { Router, Request, Response } from 'express';
import moment from 'moment';
import EditLogController from '../controllers/EditLog.controller';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.render('history', {
        moment,
        editLogs: await EditLogController.GetAllEditLogs()
    });
});

export default router;
