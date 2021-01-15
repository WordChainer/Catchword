const express = require('express');
const router = express.Router();
const UserModel = require('../models/User.js');
const SearchLogModel = require('../models/SearchLog.js');

router
    .all('*', (req, res, next) => {
        if (!res.locals.isAdmin) {
            return res.send('접근 권한이 없습니다!');
        }

        next();
    })
    .get('/', (req, res) => {
        res.send('fuck');
    })
    .get('/:id/:page?', async (req, res) => {
        let perPage = 100;
        let page = req.params.page ?? 1;
            user = await UserModel.findUser(req.params.id),
            total = await SearchLogModel.countDocuments({ user: user._id }),
            searchLogs = await SearchLogModel
                .find({ user: user._id })
                .sort({ date: -1 })
                .skip(perPage * (page - 1))
                .limit(perPage);

        res.render('logs', {
            moment: require('moment'),
            id: req.params.id,
            current: page,
            total,
            perPage,
            searchLogs
        });
    });

module.exports = router;
