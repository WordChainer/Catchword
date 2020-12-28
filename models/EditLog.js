const { Schema, model } = require('mongoose');

const EditLog = new Schema({
    action: {
        type: String,
        required: true,
        match: /^(add|delete)$/
    },
    words: [{
        type: Schema.Types.ObjectId,
        ref: 'Word'
    }],
    values: [{
        type: String,
        match: /^[가-힣]{2,3}$/
    }],
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

EditLog.statics.addLog = async function(action, values, user, words = []) {
    await this.create({ action, values, user, words });
};

module.exports = model('EditLog', EditLog, 'editLogs');
