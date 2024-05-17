const express = require('express');
const commentsRouter = express.Router({
    mergeParams: true
});
const { checkAuthenticated } = require('../middleware/auth');
const Post = require('../models/posts.model')
const Comment = require('../models/comments.model');

commentsRouter.post('/', checkAuthenticated, async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        try{
            const comment = new Comment(req.body);
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            await comment.save();

            post.comments.push(comment._id);
            await post.save();

            req.flash('success', '댓글 생성 완료.');
            res.redirect('/posts');
            
        }catch{
            req.flash('error', '댓글 생성 중 에러가 발생하였습니다.');
            res.redirect('/posts');
        }
    }catch{
        req.flash('error', '댓글 생성 중 포스트를 찾지 못하거나 에러가 발생하였습니다.');
        res.redirect('/posts');
    }

})

module.exports = commentsRouter;