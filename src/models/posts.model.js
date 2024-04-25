const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const postSchema = new mongoose.Schema({
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    image: {
        type: String
    },
    likes: [{ type: String}]
}, { timestamps: true } 
)

module.exports = mongoose.model('Post', postSchema);