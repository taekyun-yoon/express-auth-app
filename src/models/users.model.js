const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const saltRounds = 10;


const userSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minLength: 5
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    kakaoId: {
        type: String,
        unique: true,
        sparse: true,
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        default: 'First Name'
    },
    lastName: {
        type: String,
        default: 'Last Name'
    },
    bio: {
        type: String,
        default: '데이터 없음'
    },
    hometown: {
        type: String,
        default: '데이터 없음'
    },
    workplace: {
        type: String,
        default: '데이터 없음'
    },
    education: {
        type: String,
        default: '데이터 없음'
    },
    contact: {
        type: String,
        default: '01012345678'
    },
    friends: [{ type: String }],
    friendRequest: [{ type: String }]
}, {timestamps: true })


userSchema.pre("save", function (next) {
    let user = this;12

    // 비밀번호 암호화 과정
    if (user.isModified("password")) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
        });
    } else {
        next();
    }
});


userSchema.methods.comparePassword = function (plainPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
            if (err) {
                reject(err)
            } else {
                resolve(isMatch)
            }
        })
    })
}
const User = mongoose.model('User', userSchema);

module.exports = User;