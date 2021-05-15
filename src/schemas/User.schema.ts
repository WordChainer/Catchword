import { Schema } from 'mongoose';

const UserSchema = new Schema({
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
    email: {
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
}, {
    versionKey: false
});

export default UserSchema;
