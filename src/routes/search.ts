import { Router, Request, Response } from 'express';
import UserController from '../controllers/User.controller';
import WordController from '../controllers/Word.controller';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.render('search');
});

router.post('/', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(400).send({ message: '로그인 후 이용가능합니다!' });
    }

    let user = await UserController.FindUser(req.user.id);

    req.body.user = user;

    res.json(await WordController.FindWord(req.body));
});

export default router;
