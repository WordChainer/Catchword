const express = require('express');
const router = express.Router();
const UserModel = require('../models/User.js');
const WordModel = require('../models/Word.js');

router.get('/', (req, res) => {
    res.render('search');
});

router.post('/', async (req, res) => {
    if (!req.session.user) {
        return res.status(400).send({ message: '로그인 후 이용가능합니다!' });
    }

    let user = await UserModel.findUser(req.session.user.id);

    req.body.user = user;

    res.json(await WordModel.search(req.body));
});

module.exports = router;
