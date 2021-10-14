import { Router, Request, Response } from 'express';
import checkLogin from '../middlewares/checkLogin';
import IWord from '../interfaces/IWord';
import UserController from '../controllers/User.controller';
import WordController from '../controllers/Word.controller';

const router = Router();

router.use(checkLogin);
router.post('/', async (req: Request, res: Response) => {
    let user = await UserController.FindUser(req.user.id);
    let words = JSON.parse(req.body['words[]'])
        .filter((word: string): string => /^[가-힣]{2,3}$/.test(word.value.trim()))
        .map((word: string): IWord => {
            let { value, isHidden } = word;

            value = value.trim();

            return { value, length: value.length, user: user._id, isHidden };
        });
    let { result, values } = await WordController.CreateWord(words);

    if (result === 'success') {
        res.send(`${values.join('\n')}\n\n${values.length}개의 단어가 추가되었습니다.`);
    } else if (result === 'fail') {
        res.status(400).send({ message: '이미 데이터베이스에 존재하는 단어가 있습니다.' });
    }
});

export default router;
