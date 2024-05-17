const Post = require('../models/posts.model');

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next(); // next() 호출 시 오류가 발생하지 않도록 수정
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/posts');
    }
    next();
}

async function checkPostOwnerShip(req, res, next) {
    if (req.isAuthenticated()) {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
            req.flash('error', '포스트가 없거나 에러가 발생했습니다.');
            res.redirect('back');
            } else if (post.author.id.equals(req.user._id)) {
            req.post = post;
            next();
            } else {
            req.flash('error', '권한이 없습니다.');
            res.redirect('back');
            }
        } catch (err) {
            req.flash('error', '포스트가 없거나 에러가 발생했습니다.');
            res.redirect('back');
        }
    }
}


module.exports = { checkAuthenticated, checkNotAuthenticated, checkPostOwnerShip };
