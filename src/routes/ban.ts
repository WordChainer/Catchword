import { Router, Request, Response } from 'express';
import UserController from '../controllers/User.controller';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    if (!req.user || !res.locals.isAdmin) {
        return res.status(400).send({ message: '관리자만 차단을 할 수 있습니다.' });
    }

    let target = req.body.target,
        result = await UserController.BanUser(target);

    if (result.length > 0) {
        res.send(`${result}을(를) 차단했습니다.`);
    } else {
        res.status(400).send({ message: `${target}을(를) 차단하지 못했습니다.` });
    }
});

export default router;
