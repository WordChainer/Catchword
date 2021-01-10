const express = require('express');
const router = express.Router();
const UserModel = require('../models/User.js');
const searchLogModel = require('../models/SearchLog.js');

router.get('/', async (req, res) => {
    res.render('manage', {
        moment: require('moment'),
        users: await UserModel
            .find()
            .sort({ date: 1 }),
        searchCounts: await searchLogModel.aggregate([
            { $group: { _id: "$user",  count: { $sum: 1 } } }
        ])
    });
});

module.exports = router;
