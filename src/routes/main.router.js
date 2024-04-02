const express = require('express');
const mainRouter = express.Router();
const { checkNotAuthenticated, checkAuthenticated } = require('../middleware/auth');

mainRouter.get('/', checkAuthenticated, function(req, res, next) {
    res.render('index');
});

mainRouter.get('/login', checkNotAuthenticated, function(req, res, next) {
    res.render('login');
});

mainRouter.get('/signup', checkNotAuthenticated, function(req, res, next) {
    res.render('signup');
});

module.exports = mainRouter;
