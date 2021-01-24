import { Document } from 'mongoose';

export default interface IUser extends Document {
    id: string;
    vendor: string;
    nickname: string;
    email?: string;
    profile_image: string;
    isAdmin: boolean;
    isBanned: boolean;
    score: number;
    date: Date;
}
