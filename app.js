require('dotenv').config();
require('./db.js')();

const express       = require('express');
const app           = express();
const path          = require('path');
const favicon       = require('serve-favicon');
const session       = require('express-session');
const passport      = require('passport');
const bodyParser    = require('body-parser');

const routers = {
    add:        require('./routes/add.js'),
    download:   require('./routes/download.js'),
    delete:     require('./routes/delete.js'),
    help:       require('./routes/help.js'),
    history:    require('./routes/history.js'),
    index:      require('./routes/index.js'),
    login:      require('./routes/login.js'),
    loginfail:  require('./routes/loginfail.js'),
    logout:     require('./routes/logout.js'),
    logs:       require('./routes/logs.js'),
    manage:     require('./routes/manage.js'),
    search:     require('./routes/search.js')
};

const UserModel = require('./models/User.js');

const {
    CATCHWORD_HOST: host,
    CATCHWORD_PORT: port = 80,
    SESSION_SECRET: sessionSecret
} = process.env;

app
    .set('views', path.join(__dirname, '/views'))
    .set('view engine', 'pug')
    .use(express.static(path.join(__dirname, 'public')))
    .use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use(async (req, res, next) => {
        res.locals.session = req.session;
        res.locals.path = req.path;

        if (req.session.passport) {
            let user = await UserModel.findUser(req.user.id);

            res.locals.isAdmin = user.isAdmin;
        }

        next();
    })
    .use('/', routers.index)
    .use('/login', routers.login)
    .use('/loginfail', routers.loginfail)
    .use('/logout', routers.logout)
    .use('/search', routers.search)
    .use('/add', routers.add)
    .use('/delete', routers.delete)
    .use('/history', routers.history)
    .use('/manage', routers.manage)
    .use('/logs', routers.logs)
    .use('/download', routers.download)
    .use('/help', routers.help)
    .listen(port, () => console.log(`Connected to ${host}${port == 80 ? '' : `:${port}`}`));
