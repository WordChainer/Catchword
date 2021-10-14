import { Router, Request, Response } from 'express';
import dayjs from 'dayjs';
import checkLogin from '../middlewares/checkLogin';
import EditLogController from '../controllers/EditLog.controller';

const router = Router();

router.use(checkLogin);
router.get('/', async (req: Request, res: Response) => {
    res.render('history', {
        dayjs,
        editLogs: await EditLogController.GetAllEditLogs()
    });
});

export default router;
