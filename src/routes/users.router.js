const express = require('express');
const usersRouter = express.Router();
const passport = require('passport');
const { postLoginUser, postSignUpUser, postLogOutUser } = require('../controller/users.controller');

usersRouter.post('/login', postLoginUser);
usersRouter.post('/signup', postSignUpUser);
usersRouter.post('/logout', postLogOutUser);

usersRouter.get('/google', passport.authenticate('google'));
usersRouter.get('/google/callback', passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
}));

usersRouter.get('/kakao', passport.authenticate('kakao'));
usersRouter.get('/kakao/callback', passport.authenticate('kakao', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
}));

module.exports = usersRouter;