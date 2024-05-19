const express = require('express');
const friendsRouter = express.Router();
const { checkAuthenticated } = require('../middleware/auth');
const Post = require('../models/posts.model')
const Comment = require('../models/comments.model');
const User = require('../models/users.model');

friendsRouter.get('/', checkAuthenticated,async (req, res) => {
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

friendsRouter.put('/:id/add-friend', checkAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            req.flash('error', '더이상 존재하지 않는 회원입니다.');
            return res.redirect('/friends');
        }

        user.friendRequest.push(req.user._id);
        await user.save();

        req.flash('success', '친구 추가 요청을 보냈습니다.');
        res.redirect('/friends');
    } catch (err) {
        console.log(err);
        req.flash('error', '친구 추가 요청 중에 에러가 발생하였습니다.');
        res.redirect('/friends');
    }
});

friendsRouter.put('/:id/accept-friend-request', checkAuthenticated, async (req, res) => {
    try {
        const requestUser = await User.findById(req.params.id);
        if (!requestUser) {
            req.flash('error', '더이상 존재하지 않는 회원입니다.');
            return res.redirect('/friends');
        }
        const currentUser = await User.findById(req.user._id);
        if(!currentUser) {
            req.flash('error', '사용자 세션이 만료되었습니다.');
            return res.redirect('/login');
        }

        requestUser.friends.push(req.user._id);
        const updatedFriendRequest = currentUser.friendRequest.filter(friendRequest => friendRequest !== requestUser._id.toString());
        currentUser.friends.push(requestUser._id);
        currentUser.friendRequest = updatedFriendRequest;

        await requestUser.save();
        await currentUser.save();

        req.flash('success', '친구 추가 요청을 수락하였습니다.');
        res.redirect('/friends');
    } catch(err) {
        console.log(err);
        req.flash('error', '친구 추가 요청을 수락 중에 에러가 발생하였습니다.');
        res.redirect('/friends');
    }
});


friendsRouter.put('/:currentUserId/remove-friend-request/:requestId', checkAuthenticated, async (req, res) => {
    try {
        const requestUser = await User.findById(req.params.requestId);
        if (!requestUser) {
            req.flash('error', '더이상 존재하지 않는 회원입니다.');
            return res.redirect('/friends');
        }
        const currentUser = await User.findById(req.params.currentUserId);
        if(!currentUser) {
            req.flash('error', '사용자 세션이 만료되었습니다.');
            return res.redirect('/login');
        }

        const updatedFriendRequest = currentUser.friendRequest.filter(friendRequest => friendRequest !== requestUser._id.toString());
        currentUser.friendRequest = updatedFriendRequest;

        await currentUser.save();

        req.flash('success', '친구 추가 요청을 거절하였습니다.');
        res.redirect('/friends');
    } catch(err) {
        console.log(err);
        req.flash('error', '친구 추가 요청을 거절 중에 에러가 발생하였습니다.');
        res.redirect('/friends');
    }
});

friendsRouter.put('/:friendId/remove-friend', checkAuthenticated, async (req, res) => {
    try {
        const friend = await User.findById(req.params.friendId);
        if (!friend) {
            req.flash('error', '더이상 존재하지 않는 회원입니다.');
            return res.redirect('/friends');
        }
        const currentUser = await User.findById(req.user._id);
        if(!currentUser) {
            req.flash('error', '사용자 세션이 만료되었습니다.');
            return res.redirect('/login');
        }

        const updatedCurrentFriend = currentUser.friends.filter(friends => friends !== friend._id.toString());
        const updatedFriend = friend.friends.filter(friends => friends !== currentUser._id.toString());

        currentUser.friends = updatedCurrentFriend;
        friend.friends = updatedFriend;

        await currentUser.save();
        await friend.save();

        req.flash('success', '친구 최소 처리하였습니다.');
        res.redirect('/friends');
    } catch(err) {
        console.log(err);
        req.flash('error', '친구 취소 처리 중에 에러가 발생하였습니다.');
        res.redirect('/friends');
    }
});

module.exports = friendsRouter;