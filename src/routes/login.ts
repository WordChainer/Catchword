import Const from '../const.json';
import { Router, Request } from 'express';
import passport from 'passport';
import UserController from '../controllers/User.controller';
import { Strategy as NaverStrategy, Profile } from 'passport-naver';
import formatDate from '../utils/formatDate';

const router = Router();
const {
    NAVER_CLIENT_ID: clientID,
    NAVER_CLIENT_SECRET: clientSecret,
    NAVER_CALLBACK_URL: callbackURL
} = Const;
const vendor = 'naver';

passport.use(new NaverStrategy({
    clientID,
    clientSecret,
    callbackURL
}, (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
    let { nickname, profile_image } = profile._json,
        date = formatDate('HH:mm:ss');

    if (!nickname || !profile_image) {
        return done(null, false);
    }

    profile._json.vendor = vendor;

    console.log('\x1b[42m', `[${date}] Login: ${profile._json.nickname}`, '\x1b[0m');
    process.nextTick(() => done(null, profile._json));
}));

passport.serializeUser((user: any, done: any) => done(null, user));

passport.deserializeUser(async (req: Request, user: any, done: any) => {
    await UserController.CreateUser(user);

    done(null, user);
});

router
    .get('/', passport.authenticate(vendor, null))
    .get('/callback', passport.authenticate(vendor, {
        successRedirect: '/',
        failureRedirect: '/loginfail'
    }));

export default router;
