const express = require('express');
const router = express.Router();
const UserModel = require('../models/User.js');
const searchLogModel = require('../models/SearchLog.js');

router.get('/', async (req, res) => {
    if (!res.locals.isAdmin) {
        return res.send('접근 권한이 없습니다!');
    }

    let users = await UserModel.find().sort({ date: 1 }),
        searchCounts = await searchLogModel.aggregate([
            { $group: { _id: '$user',  count: { $sum: 1 } } }
        ]);

    res.render('manage', {
        moment: require('moment'),
        users,
        searchCounts
    });
});

module.exports = router;
