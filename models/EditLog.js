const { Schema, model } = require('mongoose');

const EditLog = new Schema({
    action: {
        type: String,
        required: true,
        match: /^(add|delete)$/
    },
    words: [{
        type: String,
        required: true,
        match: /^[가-힣]{2,3}$/
    }],
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String,
        required: true
    }
});

EditLog.statics.addLog = async function(action, words, user) {
    await this.create({ action, words, user });
};

module.exports = model('EditLog', EditLog, 'editLogs');
