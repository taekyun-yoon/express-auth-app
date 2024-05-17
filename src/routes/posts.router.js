const express = require('express');
const multer = require('multer');
const { checkAuthenticated, checkPostOwnerShip } = require('../middleware/auth');
const Comment = require('../models/comments.model');
const postRouter = express.Router();
const Post = require('../models/posts.model');
const path = require('path');

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
        req.flash('success', '포스트 생성 성공');
        res.redirect("/posts");
    } catch (error) {
        console.error("Error creating post:", error);
        req.flash('error', '포스트 생성 실패');
        res.redirect("/posts");
        // next(error);
    }
});

postRouter.get('/:id/edit', checkPostOwnerShip, (req, res) => {
    res.render('posts/edit', { post: req.post });
})

postRouter.put('/:id', checkPostOwnerShip, async (req, res) => {
    try{
        await Post.findByIdAndUpdate(req.params.id, req.body);
        req.flash('success', '게시물 수정 완료');
        res.redirect('/posts');

    }catch(err){
        console.log(err);
        req.flash('error', '게시물 수정 오류 발생');
        res.redirect('/posts');
    }
})

postRouter.delete('/:id', checkPostOwnerShip, async(req, res) => {
    try{
        await Post.findByIdAndDelete(req.params.id);
        req.flash('success', '게시물 삭제 완료');
        res.redirect('/posts');
    }catch(err){
        console.log(err);
        req.flash('error', '게시물 삭제 오류 발생');
        res.redirect('/posts');
    }
})

module.exports = postRouter;    