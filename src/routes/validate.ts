import { Router, Request, Response } from 'express';
import WordController from '../controllers/Word.controller';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    if (!req.user || !res.locals.isAdmin) {
        return res.status(400).send({ message: '관리자만 검수를 할 수 있습니다.' });
    }

    let words = JSON.parse(req.body['words[]'])
        .filter((word: string): string => /^[가-힣]{2,3}$/.test(word.trim()));

    let { result, values } = await WordController.ValidateWord(words);

    if (result === 'success') {
        res.send(`${values.join('\n')}\n\n${values.length}개의 단어가 검수되었습니다.`);
    } else if (result === 'fail') {
        res.status(400).send({ message: '이미 검수된 단어가 있습니다.' });
    }
});

export default router;
