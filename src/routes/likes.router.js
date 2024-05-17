const express = require('express');
const likesRouter = express.Router({
    mergeParams: true
    });
const { checkAuthenticated } = require('../middleware/auth');
const Post = require('../models/posts.model');

likesRouter.put('/', checkAuthenticated, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        console.log('포스트: ', post);

        if(post.likes.find(like => like === req.user._id.toString())) {
            const updatedLikes = post.likes.filter(like => like !== req.user._id.toString());
            try{
                await Post.findByIdAndUpdate(post._id, {likes: updatedLikes});

                req.flash('success', '게시글 좋아요 업데이트 완료.');
                res.redirect('/posts');
            }catch (err) {
                console.error(err);
                req.flash('error', '게시글 좋아요 업데이트 중에 에러가 발생하였습니다.');
                res.redirect('/posts');
            }
        }else{
            try{
                await Post.findByIdAndUpdate(post._id, {
                    likes: post.likes.concat([req.user._id])});
                req.flash('success', '게시글 좋아요 업데이트 완료.');
                res.redirect('/posts');
        }catch(err) {
            console.error(err);
            req.flash('error', '게시글 좋아요 업데이트 중에 에러가 발생하였습니다.');
            res.redirect('/posts');
        }

        }
    }catch(err) {
        console.error(err);
        req.flash('error', '좋아요 한 게시글이 없거나 에러가 발생하였습니다.');
        res.redirect('/posts');
    }
})


module.exports = likesRouter;
