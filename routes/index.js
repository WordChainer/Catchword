const express = require('express');
const router = express.Router();
const WordModel = require('../models/Word.js');

router.get('/', (req, res) => {
    Promise.all([
        WordModel.countDocuments({}),
        WordModel.countDocuments({ isHidden: true }),
        WordModel.countDocuments({ length: 3 }),
        WordModel.countDocuments({ length: 2 })
    ]).then(counts => res.render('index', { counts }));
});

module.exports = router;
