const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserModel = require('../models/User.js');
const NaverStrategy = require('passport-naver').Strategy;
const {
    NAVER_CLIENT_ID: clientID,
    NAVER_CLIENT_SECRET: clientSecret,
    NAVER_CALLBACK_URL: callbackURL
} = process.env;
const vendor = 'naver';

passport.use(new NaverStrategy({
    clientID,
    clientSecret,
    callbackURL
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile._json));
}));

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser(async (req, user, done) => {
    user.vendor = vendor;
    req.session.user = user;

    await UserModel.addUser(user);

    done(null, user);
});

router
    .get('/', passport.authenticate(vendor, null))
    .get('/callback', passport.authenticate(vendor, {
        successRedirect: '/',
        failureRedirect: '/'
    }));

module.exports = router;
