import { Router, Request, Response } from 'express';
import checkLogin from '../middlewares/checkLogin';
import checkAdmin from '../middlewares/checkAdmin';
import UserController from '../controllers/User.controller';

const router = Router();

router.use(checkLogin);
router.use(checkAdmin);
router.post('/', async (req: Request, res: Response) => {
    let target = req.body.target,
        result = await UserController.BanUser(target);

    if (result.length > 0) {
        res.send(`${result}을(를) 차단했습니다.`);
    } else {
        res.status(400).send({ message: `${target}을(를) 차단하지 못했습니다.` });
    }
});

export default router;
