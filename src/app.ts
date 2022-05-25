import Const from './const.json';
import connect from './db';
import secure from './secure';
import express from 'express';
import * as https from 'https';
import * as path from 'path';
import glob from 'fast-glob';
import compression from 'compression';
import favicon from 'serve-favicon';
import passport from 'passport';
import bodyParser from 'body-parser';
import redirectToHttps from './middlewares/redirectToHttps';
import setSession from './middlewares/setSession';
import setLocals from './middlewares/setLocals';
import logRequests from './middlewares/logRequests';
import checkBanned from './middlewares/checkBanned';

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
        this.app.use(compression());
        this.app.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')));
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(setSession());
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(setLocals);
        this.app.use(logRequests);
        this.app.use(checkBanned);
    }

    private async initializeRouters() {
        let routes = await glob('*', {
            cwd: 'src/routes',
            ignore: ['404.ts']
        });

        await Promise.all(
            routes
                .map((route: string): string => path.parse(route).name)
                .map(async (route: string) => {
                    let { default: router } = await import(`./routes/${route}`);

                    this.app.use(route === 'index' ? '/' : `/${route}`, router);
                })
        );

        let { default: router404 } = await import('./routes/404.ts');

        this.app.use(router404);
    }

}
