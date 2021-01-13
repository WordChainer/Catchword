const express = require('express');
const router = express.Router();
const UserModel = require('../models/User.js');
const SearchLogModel = require('../models/SearchLog.js');

router.get('/:id', async (req, res) => {
    let user = await UserModel.findUser(req.params.id),
        searchLogs = await SearchLogModel.find({ user: user._id  });

    res.render('logs', { searchLogs });
});

module.exports = router;
