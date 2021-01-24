import { Router, Request, Response } from 'express';
import IWord from '../interfaces/IWord';
import UserController from '../controllers/User.controller';
import WordController from '../controllers/Word.controller';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(400).send({ message: '로그인 후 이용가능합니다!' });
    }

    let user = await UserController.FindUser(req.user.id);
    let words = JSON.parse(req.body['words[]'])
        .filter((word: string): string => /^[가-힣]{2,3}$/.test(word))
        .map((word: string): IWord => {
            let value = word.trim();

            return ({ value, length: value.length, user: user._id, isHidden: false });
        });
    let { result, values } = await WordController.DeleteWord(words);
    
    if (result === 'success') {
        res.send(`${values.join('\n')}\n\n${values.length}개의 단어가 삭제되었습니다.`);
    } else if (result === 'fail') {
        res.status(400).send({ message: '데이터베이스에 존재하지 않는 단어가 있습니다.' });
    }
});

export default router;
