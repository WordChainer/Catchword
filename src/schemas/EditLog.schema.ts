import { Schema } from 'mongoose';

const EditLogSchema = new Schema({
    action: {
        type: String,
        required: true,
        match: /^(add|delete|release)$/
    },
    words: [{
        type: Schema.Types.ObjectId,
        ref: 'Word'
    }],
    values: [{
        type: String,
        match: /^[가-힣]{2,3}$/
    }],
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { 
    versionKey: false
});

export default EditLogSchema;
