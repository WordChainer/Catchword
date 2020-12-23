const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.session.destroy(() => {
        req.logout();
        res.redirect('/');              
    });
});

module.exports = router;
