const { Schema, model } = require('mongoose');
const User = require('./User.js');

const SearchLog = new Schema({
    keyword: {
        type: String,
        required: true
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
});

SearchLog.statics.addLog = async function(keyword, user) {
    await this.create({ keyword, user: user._id });
};

module.exports = model('SearchLog', SearchLog, 'searchLogs');
