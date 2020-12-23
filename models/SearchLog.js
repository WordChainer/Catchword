const { Schema, model } = require('mongoose');

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
        type: String,
        required: true
    }
});

SearchLog.statics.addLog = async function(keyword, user) {
    await this.create({ keyword, user });
};

module.exports = model('SearchLog', SearchLog, 'searchLogs');
