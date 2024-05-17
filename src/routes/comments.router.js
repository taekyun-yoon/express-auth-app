const express = require('express');
const commentsRouter = express.Router({
    mergeParams: true
});
const { checkAuthenticated, checkCommentOwnerShip } = require('../middleware/auth');
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

commentsRouter.delete('/:commentId', checkCommentOwnerShip, async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        try{
            post.comments.pop(req.params.commentId);
            try{
                await Comment.findByIdAndDelete(req.params.commentId);

                req.flash('success', '댓글 삭제 완료');
                res.redirect('/posts');
            }catch{
                req.flash('error', '댓글 삭제 중 에러가 발생하였습니다.');
                res.redirect('/posts');
            }
        }catch{
            req.flash('error', '포스트의 댓글 삭제 중 에러가 발생하였습니다.');
            res.redirect('/posts');
        }

    }catch{
        req.flash('error', '댓글 삭제 중에 포스트를 찾지 못하거나 에러가 발생하였습니다.');
        res.redirect('/posts');
    }
})

commentsRouter.get('/:commentId/edit', checkCommentOwnerShip, async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);

        console.log('post complete');
        res.render('comments/edit', { post: post, comment: req.comment});
    }catch{
        req.flash('error', '댓글에 해당하는 게시글이 없거나 에러가 발생하였습니다.');
        res.redirect('/posts');
    }

})

commentsRouter.put('/:commentId', checkCommentOwnerShip, async(req, res) => {
    try{
        await Comment.findByIdAndUpdate(req.params.commentId, req.body);

        req.flash('success', '댓글 수정 완료.');
        res.redirect('/posts');
    }catch{
        req.flash('error', '댓글 수정 중에 에러가 발생하였습니다.');
        res.redirect('/posts');
    }
})

module.exports = commentsRouter;