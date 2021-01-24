import { Document } from 'mongoose';

export default interface ISearchLog extends Document {
    keyword: string;
    user: string;
    date: Date;
}
