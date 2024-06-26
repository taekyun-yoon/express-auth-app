const passport = require('passport');
const User = require('../models/users.model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy
const dotenv = require('dotenv');
dotenv.config();

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

const googleStrategyConfig = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['email', 'profile'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
            return done(null, existingUser);
        } else {
            console.log(profile);
            const user = new User({
                email: profile.emails[0].value,
                googleId: profile.id,
                username: profile.displayName,
                firstName: profile.name.givenName,
            });

            await user.save();
            done(null, user);
        }
    } catch (err) {
        done(err);
    }
});

passport.use('google', googleStrategyConfig);

const kakaoStrategyConfig = new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    callbackURL: '/auth/kakao/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try{
            let existingUser = await User.findOne({ kakaoId: profile.id });
            
            if(existingUser) {
                return done(null, existingUser);
            } else{
                console.log(profile);
                const user = new User();
                user.kakaoId = profile.id;
                user.email = profile._json.kakao_account.email;
                user.username = profile.username;

                await user.save();
                done(null, user);
            }
        } catch (err) {
            done(err);
        }
    }
)

passport.use('kakao', kakaoStrategyConfig);