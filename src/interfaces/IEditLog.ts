import { Document } from 'mongoose';

export default interface IEditLog extends Document {
    action: string;
    words?: string[];
    values?: string[];
    user: string;
    date: Date;
}
