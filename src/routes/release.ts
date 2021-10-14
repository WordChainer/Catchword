import { Router, Request, Response } from 'express';
import checkLogin from '../middlewares/checkLogin';
import checkAdmin from '../middlewares/checkAdmin';
import UserController from '../controllers/User.controller';
import WordController from '../controllers/Word.controller';

const router = Router();

router.use(checkLogin);
router.use(checkAdmin);
router.post('/', async (req: Request, res: Response) => {
    let user = await UserController.FindUser(req.user.id);
    let words = JSON.parse(req.body['words[]'])
        .filter((word: string): string => /^[가-힣]{2,3}$/.test(word.trim()));

    let { result, values } = await WordController.ReleaseWord({ words, user });

    if (result === 'success') {
        res.send(`${values.join('\n')}\n\n${values.length}개의 단어가 공개되었습니다.`);
    } else if (result === 'fail') {
        res.status(400).send({ message: '오류가 발생했습니다.' });
    }
});

export default router;
