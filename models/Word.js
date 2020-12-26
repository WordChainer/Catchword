const { Schema, model } = require('mongoose');
const User = require('./User.js');
const SearchLog = require('./SearchLog.js');
const EditLog = require('./EditLog.js');

const Word = new Schema({
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
    isHidden: {
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
});

Word.statics.add = async function(words) {
    try {
        let docs = await this.insertMany(words),
            added = docs.map(doc => doc.value);
        let user = await User.findOne({ _id: words[0].user._id });

        EditLog.addLog('add', added, user.nickname);

        return ({ result: 'success', added });
    } catch (err) {
        return ({ result: 'fail', added: [] });
    }
};

Word.statics.delete = async function(words) {
    try {
        let res = await this.deleteMany({ value: { $in: words.map(word => word.value) } }),
            deleted = words.map(word => word.value);
        let user = await User.findOne({ _id: words[0].user._id });
        
        EditLog.addLog('delete', deleted, user.nickname);

        return ({ result: 'success', deleted });
    } catch (err) {
        console.log(err);

        return ({ result: 'fail', deleted: [] });
    }
};

Word.statics.search = async function({ keyword, length, user }) {
    let reverse = false;

    keyword = keyword.replace(/\s/g, '');

    if (keyword === '' || /^\.{1,3}$/.test(keyword)) {
        return [];
    }

    SearchLog.addLog(keyword, user);

    if (/^-/.test(keyword)) {
        reverse = true;
        keyword = keyword.match(/[가-힣]+/)[0];
    }

    let rgx = keyword.includes('.') ? `^${keyword}$` : reverse ? `${keyword}$` : `^${keyword}`;

    return await this
        .find({
            $and: [
                { length },
                { value: { $regex: rgx } }
            ]
        })
        .populate({
            path: 'user',
            select: 'nickname'
        })
        .select({
            _id: false,
            value: true,
            date: true,
            user: true
        })
        .sort({ value: 1 });
};

module.exports = model('Word', Word, 'words');
