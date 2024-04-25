const express = require('express');
const mainRouter = express.Router();
const { checkNotAuthenticated, checkAuthenticated } = require('../middleware/auth');

mainRouter.get('/', checkAuthenticated, function(req, res, next) {
    res.redirect('/login');
});

mainRouter.get('/login', checkNotAuthenticated, function(req, res, next) {
    res.render('auth/login', { currentUser: req.user});
});

mainRouter.get('/signup', checkNotAuthenticated, function(req, res, next) {
    res.render('auth/signup', { currentUser: req.user});
});

module.exports = mainRouter;
