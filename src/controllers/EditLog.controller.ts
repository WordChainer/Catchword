import IWord from '../interfaces/IWord';
import IEditLog from '../interfaces/IEditLog';
import EditLog from '../models/EditLog.model';

interface ICreateEditLogInput {
    action: IEditLog['action'];
    values: IEditLog['values'];
    user: IEditLog['user'];
    words: IWord[];
}

async function CreateEditLog({ action, values, user, words = [] }: ICreateEditLogInput) {
    words = words.map((word: IWord): IWord['_id'] => word._id);

    await EditLog.create({ action, values, user, words });
}

async function GetAllEditLogs(): Promise<IEditLog[]> {
    return await EditLog.find()
        .populate([{
            path: 'words',
            select: 'isHidden'
        }, {
            path: 'user',
            select: ['nickname', 'profile_image']
        }])
        .sort({ date: -1 });
}

export default { CreateEditLog, GetAllEditLogs };
