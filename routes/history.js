const express = require('express');
const router = express.Router();
const EditLogModel = require('../models/EditLog.js');

router.get('/', async (req, res) => {
    res.render('history', {
        moment: require('moment'),
        editLogs: await EditLogModel
            .find()
            .sort({ date: -1 })
    });
});

module.exports = router;
