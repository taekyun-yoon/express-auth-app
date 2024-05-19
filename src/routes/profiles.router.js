const express = require('express');
const profileRouter = express.Router({
    mergeParams: true
});
const { checkAuthenticated, checkIsMe } = require('../middleware/auth');
const User = require('../models/users.model');
const Post = require('../models/posts.model');

profileRouter.get('/', checkAuthenticated, async (req, res) => {
    try{
        const posts = await Post.find({ "author.id": req.params.id }).populate("comments").sort( { createdAt: -1 });
        try{
            const user = await User.findById(req.params.id);
            res.render('profile', {
                posts: posts,
                user: user
            });
        }catch(err) {
            console.log(err);   
            req.flash('error', 'User not found');
            res.redirect('/posts');
        }        
    }catch(err) {
        console.log(err);   
        req.flash('error', 'Posts not found');
        res.redirect('/posts');
    }
}) 

profileRouter.get('/edit', checkIsMe, (req, res) => {
    res.render('profile/edit', { user: req.user});
});

profileRouter.put('/', checkIsMe, async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body);

        req.flash('success', '유저 데이터를 업데이트하는데 성공했습니다.');
        res.redirect('/profile/' + req.params.id);
    }catch(err) {
        req.flash('error', '유저 데이터를 업데이트하는데 에러가 발생했습니다.');
        res.redirect('/profile/' + req.params.id);
    }
})

module.exports = profileRouter;