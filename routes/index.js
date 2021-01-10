const express = require('express');
const router = express.Router();
const glob = require('fast-glob');
const WordModel = require('../models/Word.js');

router.get('/', async (req, res) => {
    let slides = await glob('images/slide*.jpg', { cwd: 'public' });
    let counts = await Promise.all([
        WordModel.countDocuments({}),
        WordModel.countDocuments({ isHidden: true }),
        WordModel.countDocuments({ length: 3 }),
        WordModel.countDocuments({ length: 2 })
    ]);

    res.render('index', { slides, counts });
});

module.exports = router;
