const express = require('express');
const router = express.Router();
const WordModel = require('../models/Word.js');

router.get('/', (req, res) => {
    res.render('help');
});

module.exports = router;
