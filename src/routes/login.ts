import { Router, Request } from 'express';
import passport from 'passport';
import UserController from '../controllers/User.controller';
import { Strategy as NaverStrategy } from 'passport-naver';

const router = Router();
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
}, (accessToken: string, refreshToken: string, profile: any, done: any) => {
    let { nickname, profile_image } = profile._json;

    if (!nickname || !profile_image) {
        return done(null, false);
    }

    profile._json.vendor = vendor;

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
