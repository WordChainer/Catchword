import Const from '../const.json';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import session from 'express-session';

export default function setSession() {
    let options = {
        secret: Const.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: Const.IS_SECURED ? true : false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient()
        })
    };

    return session(options);
}
