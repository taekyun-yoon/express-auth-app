const express = require('express');
const postRouter = express.Router();
const passport = require('passport');
const Post = require("../models/posts.model");
const { checkNotAuthenticated, checkAuthenticated } = require('../middleware/auth');
const Comment = require("../models/comments.model");

postRouter.get('/', checkAuthenticated, function(req, res, next) {
    Post.find()
        .populate("comments")
        .sort({createdAt: -1})
        .exec()
        .then(posts =>{
                res.render('posts', {
                    posts: posts,
                    currentUser: req.user
                });
        }) 
        .catch(err => {
            console.log("Error occurred");
            next(err);
        })
})


module.exports = postRouter;