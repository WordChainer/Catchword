import IUser from '../interfaces/IUser';
import IWord from '../interfaces/IWord';
import User from '../models/User.model';
import Word from '../models/Word.model';
import EditLogController from './EditLog.controller';
import SearchLogController from './SearchLog.controller';

interface ICreateWordResult {
    result: string;
    values: IWord['value'][];
}

interface IDeleteWordResult extends ICreateWordResult {}
interface IValidateWordResult extends ICreateWordResult {}
interface IReleaseWordResult extends ICreateWordResult {}

interface IFindWordInput {
    keyword: string;
    length: number;
    user: IUser;
}

interface IReleaseWordInput {
    words: string[];
    user: IUser;
}

async function CreateWord(words: IWord[]): ICreateWordResult {
    try {
        let docs = await Word.insertMany(words),
            values = docs.map((doc: Iword): IWord['value'] => doc.value);
        let user = await User.findOne({ _id: words[0].user._id });

        EditLogController.CreateEditLog({ action: 'add', values, user: user._id, words: docs.map(doc => doc._id) });

        return ({ result: 'success', values });
    } catch (err: Error) {
        return ({ result: 'fail', values: [] });
    }
}

async function DeleteWord(words: IWord[]): IDeleteWordResult {
    try {
        let values = words.map(word => word.value),
            user = await User.findOne({ _id: words[0].user._id });
        
        await Word.deleteMany({ value: { $in: words.map(word => word.value) } });

        EditLogController.CreateEditLog({ action: 'delete', values, user: user._id, words });

        return ({ result: 'success', values });
    } catch (err: Error) {
        return ({ result: 'fail', values: [] });
    }
}

async function ValidateWord(words: string[]): IValidateWordResult {
    try {
        await Word.updateMany({ value: { $in: words } }, { $set: { isValidated: true } });

        return ({ result: 'success', values: words });
    } catch (err: Error) {
        console.log(err);

        return ({ result: 'fail', values: [] });
    }
}

async function ReleaseWord({ words, user }: IReleaseWordInput): IReleaseWordResult {
    try {
        await Word.updateMany({ value: { $in: words } }, { $set: { isHidden: false } });

        EditLogController.CreateEditLog({ action: 'release', values: words, user: user._id });

        return ({ result: 'success', values: words });
    } catch (err: Error) {
        console.log(err);

        return ({ result: 'fail', values: [] });
    }
}

async function FindWord({ keyword, length, user }: IFindWordInput): Promise<IWord[]> {
    let reverse = false;

    keyword = keyword.replace(/\s/g, '');
    length = +length;

    let rgxCommas = /^-?\.{1,3}$/,
        rgxValid = /^-?[ㄱ-ㅎ가-힣.]+$/,
        rgxValidJaum = /[ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ]/g,
        rgxJaum = /[ㄱ-ㅎ]+/,
        rgxJaumDeficient = new RegExp(`^[ㄱ-ㅎ]{1,${length - 1}}$`),
        rgxHyphenOrComma = /-|\./,
        rgxWithoutHyphen = /(?<=-).+/;

    if (keyword === '' || rgxCommas.test(keyword)) {
        return [];
    }

    if (!rgxValid.test(keyword)) {
        return [];
    }

    if (rgxJaum.test(keyword) && rgxHyphenOrComma.test(keyword)) {
        return [];
    }

    if (rgxJaumDeficient.test(keyword)) {
        return [];
    }

    if (!user.isBot) {
        SearchLogController.CreateSearchLog(keyword, user);
    }

    if (keyword.startsWith('-')) {
        reverse = true;
        keyword = keyword.match(rgxWithoutHyphen)[0];
    }

    keyword = keyword.replace(rgxValidJaum, makeHangulRange);

    let rgx = keyword.includes('.') ? `^${keyword}$` : reverse ? `${keyword}$` : `^${keyword}`,
        conditions = [
            { length },
            { value: { $regex: rgx } }
        ];

    if (!user.isAdmin) {
        conditions.push({ isHidden: false });
    }

    return await Word
        .find({ $and: conditions })
        .populate({
            path: 'user',
            select: 'nickname'
        })
        .select({ _id: false })
        .sort({ value: 1 });
}

function assembleHangul(ca, cb, cc) {
    return String.fromCharCode(ca * 588 + cb * 28 + cc + 44032);
}

function makeHangulRange(jaum) {
    let code = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.indexOf(jaum);

    return `[${assembleHangul(code, 0, 0)}-${assembleHangul(code, 20, 27)}]`;
}


export default { CreateWord, DeleteWord, ValidateWord, ReleaseWord, FindWord };
