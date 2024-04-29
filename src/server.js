const express = require('express');
const router = express.Router();
const path = require('path');
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const dotenv = require("dotenv");
const config = require('config');

//router
const mainRouter = require('./routes/main.router');
const usersRouter = require('./routes/users.router');
const postRouter = require('./routes/posts.router');
// const commentsRouter = require('./routes/comments.router');
// const profilesRouter = require('./routes/profiles.router');
// const likRouter = require('./routes/likes.router');
// const friendsRouter = require('./routes/friends.router');

const serverConfig = config.get('server');
const cookieConfig = config.get('cookie');
const PORT = serverConfig.port;

dotenv.config();
const app = express();
const cookieEncryptionKey = cookieConfig.secret;

const helmet =require('helmet');
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://use.fontawesome.com/",
    "https://cdnjs.cloudflare.com/"
];
const connectSrcUrls = [];
const fontSrcUrls = [
    "https://cdnjs.cloudflare.com/", 
];

const cspOptions = {
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
            "'self'",
            "blob:",
            "data:",
        ],
        fontSrc: ["'self'", ...fontSrcUrls],
    }
};

app.use(helmet({
    contentSecurityPolicy: cspOptions,
}));

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

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
//form 태그에서 값을 가져올 수 있음
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
app.use('/posts', postRouter);
// app.use("/posts/:id/comments", commentsRouter);
// app.use("/profile/:id", profilesRouter);
// app.use("/friends", friendsRouter);
// app.use(likRouter);

module.exports = router