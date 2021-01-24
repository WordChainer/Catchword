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

export default { CreateUser, FindUser };
