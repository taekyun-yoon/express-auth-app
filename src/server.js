const express = require('express');
const path = require('path');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const dotenv = require("dotenv");
const config = require('config');
const mainRouter = require('./routes/main.router');
const usersRouter = require('./routes/users.router');
const serverConfig = config.get('server');
const cookieConfig = config.get('cookie');
const PORT = serverConfig.port;

dotenv.config();
const app = express();
const cookieEncryptionKey = cookieConfig.secret;

const helmet =require('helmet');

app.use(helmet());

// cookie-session: client에서 보관
app.use(
    cookieSession({
        maxAge: cookieConfig.expiresIn,
        keys: [cookieEncryptionKey]
    })
);

// register regenerate & save after the cookieSession middleware initialization
// https://github.com/jaredhanson/passport/issues/907
// passport 6.0 cookie-session 같이 사용하면 나오는 에러
app.use(function (request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`listening on ${PORT}...`);
});

app.use('/', mainRouter);
app.use('/auth', usersRouter);