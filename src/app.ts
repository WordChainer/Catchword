import Const from './const.json';
import connect from './db';
import secure from './secure';
import express, { Request, Response, NextFunction } from 'express';
import * as https from 'https';
import * as path from 'path';
import glob from 'fast-glob';
import favicon from 'serve-favicon';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import redirectToHttps from './middlewares/redirectToHttps';
import setLocals from './middlewares/setLocals'

export default class App {
    public app: express.Application;

    constructor() {
        this.app = express();

        this.connectToDatabase();
        this.initializeTemplate();
        this.initializeAssets();
        this.initializeMiddlewares();
        this.initializeRouters();
    }

    public listen() {
        this.app.listen(80, () => {
            console.log('Connected to http');
        });

        if (Const.IS_SECURED) {
            let options = secure();

            https.createServer(options, this.app).listen(443, () => {
                console.log('Connected to https');
            });
        }
    }

    private connectToDatabase() {
        connect();
    }

    private initializeTemplate() {
        this.app.set('views', path.join(__dirname, '../views'));
        this.app.set('view engine', 'pug');
    }

    private initializeAssets() {
        this.app.use(express.static(path.join(__dirname, '../public')));
    }

    private initializeMiddlewares() {
        this.app.use(redirectToHttps);
        this.app.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')));
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(session({
            secret: Const.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            },
            store: MongoStore.create({
                client: mongoose.connection.getClient()
            })
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(setLocals);
    }

    private async initializeRouters() {
        let routes = await glob('*', { cwd: 'src/routes' });

        routes
            .map((route: string): string => path.parse(route).name)
            .forEach(async (route: string) => {
                let { default: router } = await import(`./routes/${route}`);

                this.app.use(route === 'index' ? '/' : `/${route}`, router);
            });
    }
}
