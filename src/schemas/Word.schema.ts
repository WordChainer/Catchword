import { Schema } from 'mongoose';

const WordSchema = new Schema({
    value: {
        type: String,
        required: true,
        unique: true,
        match: /^[가-힣]{2,3}$/
    },
    length: {
        type: Number,
        required: true,
        index: true,
        min: 2,
        max: 3
    },
    needFilter: {
        type: Boolean,
        deafault: false
    },
    isHidden: {
        type: Boolean,
        default: false
    },
    isValidated: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    versionKey: false
});

export default WordSchema;
