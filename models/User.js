const { Schema, model } = require('mongoose');

const User = Schema({
    id: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        defualt: false
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    score: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});

User.statics.findUser = async function(id) {
    return await this.findOne({ id });
};

User.statics.addUser = async function(user) {
    let { id, nickname, profile_image } = user;

    if (!await this.findOne({ id: id })) {
        await this.create(user, (err, doc) => {
            return true;
        });
    } else {
        await this.updateOne({ id: id }, { $set: { nickname, profile_image } });
    }

    return false;
};

module.exports = model('User', User, 'users');
