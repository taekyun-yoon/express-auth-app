const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
