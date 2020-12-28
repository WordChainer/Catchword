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
            values = docs.map(doc => doc.value);
        let user = await User.findOne({ _id: words[0].user._id });

        EditLog.addLog('add', values, user._id, docs.map(doc => doc._id));

        return ({ result: 'success', values });
    } catch (err) {
        return ({ result: 'fail', values: [] });
    }
};

Word.statics.delete = async function(words) {
    try {
        let res = await this.deleteMany({ value: { $in: words.map(word => word.value) } }),
            values = words.map(word => word.value);
        let user = await User.findOne({ _id: words[0].user._id });
        
        EditLog.addLog('delete', values, user._id);

        return ({ result: 'success', values });
    } catch (err) {
        console.log(err);

        return ({ result: 'fail', values: [] });
    }
};

Word.statics.search = async function({ keyword, length, user }) {
    let reverse = false;

    keyword = keyword.replace(/\s/g, '');

    if (keyword === '' || /^\.{1,3}$/.test(keyword)) {
        return [];
    }

    if (!/^-?[ㄱ-ㅎ가-힣.]+$/.test(keyword)) {
        return [];
    }

    SearchLog.addLog(keyword, user);

    if (/^-/.test(keyword)) {
        reverse = true;
        keyword = keyword.match(/(?<=-).+/)[0];
    }

    keyword = keyword.replace(/[ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ]/g, makeHangulRange);

    let rgx = keyword.includes('.') ? `^${keyword}$` : reverse ? `${keyword}$` : `^${keyword}`,
        conditions = [
            { length },
            { value: { $regex: rgx } }
        ];

    if (!user.isAdmin) {
        conditions.push({ isHidden: false });
    }

    return await this
        .find({
            $and: conditions
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

function hangulAssemble(ca, cb, cc) {
    return String.fromCharCode(ca * 588 + cb * 28 + cc + 44032);
}

function makeHangulRange(jaum) {
    let code = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.indexOf(jaum);

    return `[${hangulAssemble(code, 0, 0)}-${hangulAssemble(code, 20, 27)}]`;
}

module.exports = model('Word', Word, 'words');
