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

interface IFindWordInput {
    keyword: string;
    length: number;
    user: IUser;
}

async function CreateWord(words: IWord[]): ICreateWordResult {
    try {
        let docs = await Word.insertMany(words),
            values = docs.map((doc: Iword): IWord['value'] => doc.value);
        let user = await User.findOne({ _id: words[0].user._id });

        EditLogController.CreateEditLog({ action: 'add', values, user: user._id, words });

        return ({ result: 'success', values });
    } catch (err: Error) {
        return ({ result: 'fail', values: [] });
    }
}

async function DeleteWord(words: IWord[]): IDeleteWordResult {
    try {
        let res = await Word.deleteMany({ value: { $in: words.map(word => word.value) } }),
            values = words.map(word => word.value);
        let user = await User.findOne({ _id: words[0].user._id });
        
        EditLogController.CreateEditLog({ action: 'delete', values, user: user._id, words });

        return ({ result: 'success', values });
    } catch (err: Error) {
        return ({ result: 'fail', values: [] });
    }
}

async function FindWord({ keyword, length, user }: IFindWordInput): Promise<IWord[]> {
    let reverse = false;

    keyword = keyword.replace(/\s/g, '');
    length = +length;

    if (keyword === '' || /^\.{1,3}$/.test(keyword)) {
        return [];
    }

    if (!/^-?[ㄱ-ㅎ가-힣.]+$/.test(keyword)) {
        return [];
    }

    let rgxJaum = new RegExp(`^[ㄱ-ㅎ]{1,${length - 1}}$`);

    if (rgxJaum.test(keyword)) {
        return [];
    }

    SearchLogController.CreateSearchLog(keyword, user);

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

    return await Word.find({ $and: conditions })
        .populate({
            path: 'user',
            select: 'nickname'
        })
        .select({
            _id: false,
            value: true,
            date: true,
            user: true,
            isHidden: true
        })
        .sort({ value: 1 });
}

function hangulAssemble(ca, cb, cc) {
    return String.fromCharCode(ca * 588 + cb * 28 + cc + 44032);
}

function makeHangulRange(jaum) {
    let code = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.indexOf(jaum);

    return `[${hangulAssemble(code, 0, 0)}-${hangulAssemble(code, 20, 27)}]`;
}


export default { CreateWord, DeleteWord, FindWord };
