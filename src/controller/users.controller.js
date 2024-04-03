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
            res.redirect('/');
        })
    })(req, res, next);
}

async function postSignUpUser(req, res, next) {
    const user = new User(req.body);
    console.log(req.body);
    try{
        await user.save();
        sendMail(user.email, user.id, 'welcome');
        
        return res.redirect('/login');
    } catch (err) {
        return res.json({ success: false, err }); 
        //err code: 11000 : cause : DuplicateKey
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

module.exports = {
    postLoginUser,
    postSignUpUser,
    postLogOutUser
}