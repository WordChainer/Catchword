import { Schema } from 'mongoose';

const SearchLogSchema = new Schema({
    keyword: {
        type: String,
        required: true
    },
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

export default SearchLogSchema;
