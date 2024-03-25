const express = require('express');
const path = require('path');
const { default: mongoose, Mongoose } = require('mongoose');
const User = require('./models/users.model');
const passport = require('passport');
const cookieSession = require('cookie-session');
const dotenv = require("dotenv");
const { checkAuthenticated, checkNotAuthenticated } = require('./middleware/auth');

dotenv.config();
const app = express();
const PORT = 3000;
const cookieEncryptionKey = 'super-secret-key';

// cookie-session: client에서 보관
app.use(
    cookieSession({
        maxAge: 1209600000,
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


app.get('/', checkAuthenticated, function(req, res, next) {
    res.render('index');
})

app.get('/login', checkNotAuthenticated,function(req, res, next) {
    res.render('login');
});

app.post('/login', async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.json({ msg: info });
        }

        req.logIn(user, function (err) {
            if (err) { return next(err); }
            res.redirect('/');
        })
    })(req, res, next)
})

app.get('/signup', checkNotAuthenticated,function(req, res, next) {
    res.render('signup');
});

app.post('/signup', async (req, res, next) => {
    const user = new User(req.body);
    console.log(req.body);
    try{
        await user.save();
        return res.render('login');
    } catch (err) {
        return res.json({ success: false, err }); 
        //err code: 11000 : cause : DuplicateKey
    }
});