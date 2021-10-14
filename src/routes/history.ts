import { Router, Request, Response } from 'express';
import checkLogin from '../middlewares/checkLogin';
import EditLogController from '../controllers/EditLog.controller';
import dayjs from 'dayjs';

const router = Router();

router.use(checkLogin);
router.get('/', async (req: Request, res: Response) => {
    res.render('history', {
        dayjs,
        editLogs: await EditLogController.GetAllEditLogs()
    });
});

export default router;
