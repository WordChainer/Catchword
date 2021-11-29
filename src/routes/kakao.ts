import { Router, Request, Response } from 'express';
import WordController from '../controllers/Word.controller';
import Logger from '../utils/Logger';

const router = Router();
const logger = new Logger();

router.post('/message', async (req: Request, res: Response) => {
    let message = req.body.userRequest.utterance.trim(),
        data;

    if (message.startsWith('$검색')) {
        let keyword = message.replace('$검색', '').trim(),
            words = await WordController.FindWord({
                keyword,
                length: 3,
                user: {
                    isBot: true,
                    isAdmin: false
                }
            });

        words = words.map(word => word.value);
        data = {
            version: '2.0',
            template: {
                outputs: [{
                    simpleText: {
                        text: words.length < 1 
                            ? '검색 결과가 없습니다.'
                            : `${words.length} 개의 단어가 검색되었습니다.\n\n${words.join('\n')}`
                    }   
                }]
            }
        };

        logger.warn(`Search(Kakao): ${req.body.userRequest.user.id} [${keyword}]`);
    }

    res.json(data);
});

export default router;
