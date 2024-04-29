const passport = require("passport");
const User = require("../models/users.model");
const sendMail = require("../mail/mail");

function postLoginUser(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.json({ msg: info });
        }

        req.logIn(user, function (err) {
            if (err) { return next(err); }
            res.redirect('/posts');
        })
    })(req, res, next);
}

async function postSignUpUser(req, res, next) {
    const user = new User(req.body);

    await validateEmail(req, res, next);
    try{
        await user.save();
        sendMail(user.email, user.id, 'welcome');
        
        return res.redirect('/login');
    } catch (err) {
        return res.render('partials/validation-modal');
    }
}

function postLogOutUser(req, res, next) {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
        res.redirect('/login');
    })
}

async function validateEmail(req, res, next) {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).render('partials/validation-modal', { validation: 'email' }); // Pass validation error to signup page
    }
    next();
}

module.exports = {
    postLoginUser,
    postSignUpUser,
    postLogOutUser
}