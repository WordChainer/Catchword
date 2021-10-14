import { Router, Request, Response } from 'express';
import checkLogin from '../middlewares/checkLogin';
import UserController from '../controllers/User.controller';
import WordController from '../controllers/Word.controller';
import Logger from '../utils/Logger';

const router = Router();
const logger = new Logger();

router.get('/', (req: Request, res: Response) => {
    res.render('search');
});
router.post('*', checkLogin);
router.post('/', async (req: Request, res: Response) => {
    let user = await UserController.FindUser(req.user.id);

    req.body.user = user;

    res.json(await WordController.FindWord(req.body));
    logger.warn(`Search: ${user.nickname} [${req.body.keyword}]`);
});

export default router;
