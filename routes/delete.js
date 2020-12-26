const express = require('express');
const router = express.Router();
const WordModel = require('../models/Word.js');
const UserModel = require('../models/User.js');

router.post('/', async (req, res) => {
    if (!req.session.user) {
        return res.status(400).send({ message: '로그인 후 이용가능합니다!' });
    }

    let user = await UserModel.findUser(req.session.user.id);
    let words = JSON.parse(req.body['words[]'])
        .filter(word => /^[가-힣]{2,3}$/.test(word))
        .map(word => ({ value: word, user: user._id }));
    let { result, values } = await WordModel.delete(words);
    
    if (result === 'success') {
        res.send(`${values.join('\n')}\n\n${values.length}개의 단어가 삭제되었습니다.`);
    } else if (result === 'fail') {
        res.status(400).send({ message: '데이터베이스에 존재하지 않는 단어가 있습니다.' });
    }
});

module.exports = router;
