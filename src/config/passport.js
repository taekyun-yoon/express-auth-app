const passport = require('passport');
const User = require('../models/users.model');
const LocalStrategy = require('passport-local').Strategy;

//req.login(user)
passport.serializeUser((user, done) => {
    console.log('---serializeUser---');
    done(null, user.id);
})

//client -> session -> request
passport.deserializeUser((id, done)  => {
    console.log('---deserializeUser---');
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});


const localStrategyConfig = new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
        console.log('LocalStrategy');
        console.log('password: ', password);
        console.log('email: ', email);
        try {
            const user = await User.findOne({ email: email.toLowerCase() });

            if (!user) {
                return done(null, false, { msg: `Email ${email} not found.` });
            }else{
                console.log(`user: ${user}`);
            }

            const isMatch = await user.comparePassword(password);
            console.log('isMatch: ', isMatch);

            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { msg: 'Invalid email or password' });
            }
        } catch (err) {
            return done(err);
        }
    });

passport.use('local', localStrategyConfig);