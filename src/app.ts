import connect from './db';
import express, { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import glob from 'fast-glob';
import favicon from 'serve-favicon';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import UserController from './controllers/User.controller';

const {
    CATCHWORD_HOST: host,
    CATCHWORD_PORT: port = 80,
    SESSION_SECRET: sessionSecret
} = process.env;

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
        this.app.listen(port, () => {
            console.log(`Connected to ${host}${port == 80 ? '' : `:${port}`}`)
        });
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
        this.app.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')));
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(session({
            secret: sessionSecret,
            resave: false,
            saveUninitialized: true
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(async (req: Request, res: Response, next: NextFunction) => {
            res.locals.session = req.session;
            res.locals.path = req.path;

            if (req.session.passport) {
                let user = await UserController.FindUser(req.user.id);

                res.locals.isAdmin = user.isAdmin;
            }

            next();
        });
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
