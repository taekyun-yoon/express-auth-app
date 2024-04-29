const express = require('express');
const postRouter = express.Router();
const passport = require('passport');
const Post = require("../models/posts.model");
const { checkNotAuthenticated, checkAuthenticated } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const Comment = require("../models/comments.model");



const storageEngin = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '../public/assets/images'))
    },
    filename: (res, file, callback) => {
        callback(null, file.originalname)
    }
})

const upload = multer({ storage: storageEngin}).single('image');

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

postRouter.post('/', checkAuthenticated, upload, async (req, res, next) => {
    let desc = req.body.desc;
    let image = req.file ? req.file.filename : "";
    try {
        await Post.create({
            image: image,
            description: desc,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        });
        console.log('desc: ' + desc);
        res.redirect("back");
    } catch (error) {
        console.error("Error creating post:", error);
        next(error);
    }
});


module.exports = postRouter;