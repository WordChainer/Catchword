import IUser from '../interfaces/IUser';
import User from '../models/User.model';

interface ICreateUserInput {
    id: IUser['id'];
    nickname: IUser['nickname'];
    email: IUser['email'];
    profile_image: IUSer['profile_image'];
}

async function CreateUser({ id, nickname, email, profile_image }: ICreateUserInput) {
    await User.findOneAndUpdate(
        { id },
        { nickname, email, profile_image },
        { upsert: true, setDefaultsOnInsert: true }
    );
}

async function FindUser(id: IUser['id']): Promise<IUser> {
    return await User.findOne({ id });
}

async function BanUser(id: IUser['id']): IUser['nickname'] {
    try {
        let user = await FindUser(id);

        if (user.isBanned || user.isAdmin) {
            throw new Error();
        }

        await User.updateOne({ id }, { $set: { isBanned: true } });

        return user.nickname;
    } catch (err: Error) {
        return '';
    }
}

export default { CreateUser, FindUser, BanUser };
