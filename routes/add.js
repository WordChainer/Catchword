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
        .filter(word => /^[가-힣]{2,3}$/.test(word.value))
        .map(word => {
            let { value, isHidden } = word;

            return { value, length: value.length, user: user._id, isHidden };
        });
    let { result, values } = await WordModel.add(words);

    if (result === 'success') {
        res.send(`${values.join('\n')}\n\n${values.length}개의 단어가 추가되었습니다.`);
    } else if (result === 'fail') {
        res.status(400).send({ message: '이미 데이터베이스에 존재하는 단어가 있습니다.' });
    }
});

module.exports = router;
