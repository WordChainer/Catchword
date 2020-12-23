const express = require('express');
const router = express.Router();
const WordModel = require('../models/Word.js');

router.post('/', async (req, res) => {
    /*
    if (!req.session.user) {
        return res.status(400).send({ message: '로그인 후 이용가능합니다!' });
    }
    */

    req.body.user = req.session.user?.nickname ?? 'GUEST';

    res.json(await WordModel.search(req.body));
});

module.exports = router;
