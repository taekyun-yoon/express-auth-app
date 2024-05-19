const express = require('express');
const friendsRouter = express.Router();
const { checkAuthenticated } = require('../middleware/auth');
const Post = require('../models/posts.model')
const Comment = require('../models/comments.model');
const User = require('../models/users.model');

friendsRouter.get('/', async (req, res) => {
    try{
        const users = await User.find();

        console.log('users: ', users);
        res.render('friends/index', {
            users: users,
            currentUser: req.user
        })
    }
    catch(err) {
        console.log(err);
        res.redirect('/posts');
    }
})

module.exports = friendsRouter;