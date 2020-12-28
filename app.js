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
    add:     require('./routes/add.js'),
    delete:  require('./routes/delete.js'),
    history: require('./routes/history.js'),
    login:   require('./routes/login.js'),
    logout:  require('./routes/logout.js'),
    search:  require('./routes/search.js'),
    index:    require('./routes/index.js')
};

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
    .use((req, res, next) => {
        res.locals.session = req.session;

        next();
    })
    .use('/', routers.index)
    .use('/login', routers.login)
    .use('/logout', routers.logout)
    .use('/search', routers.search)
    .use('/add', routers.add)
    .use('/delete', routers.delete)
    .use('/history', routers.history)
    .listen(port, () => console.log(`Connected to ${host}${port == 80 ? '' : `:${port}`}`));
