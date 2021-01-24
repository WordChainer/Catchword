import SearchLog from '../models/SearchLog.model';

async function CreateSearchLog(keyword: string, user: IUser) {
    await SearchLog.create({ keyword, user: user._id });
}

export default { CreateSearchLog };
