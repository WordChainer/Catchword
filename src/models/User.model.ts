import { model } from 'mongoose';
import IUser from '../interfaces/IUser';
import UserSchema from '../schemas/User.schema';

const User = model<IUser>('User', UserSchema);

export default User;
