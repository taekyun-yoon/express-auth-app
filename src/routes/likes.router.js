const express = require('express');
const likesRouter = express.Router({
    mergeParams: true
});
const { checkAuthenticated } = require('../middleware/auth');
const Post = require('../models/posts.model');

likesRouter.put('/', checkAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        let updatedLikes;
        if (post.likes.includes(req.user._id.toString())) {
            // 좋아요 취소 로직
            updatedLikes = post.likes.filter(like => like !== req.user._id.toString());
        } else {
            // 좋아요 추가 로직
            updatedLikes = post.likes.concat([req.user._id.toString()]);
        }

        await Post.findByIdAndUpdate(post._id, { likes: updatedLikes });

        res.json({ success: true, likesCount: updatedLikes.length, liked: !post.likes.includes(req.user._id.toString()) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '좋아요 업데이트 중에 에러가 발생하였습니다.' });
    }
});

module.exports = likesRouter;
