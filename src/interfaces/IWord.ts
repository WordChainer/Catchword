import { Document } from 'mongoose';

export default interface IWord extends Document {
    value: string;
    length: number;
    isHidden: boolean;
    isValidated: boolean;
    date: Date;
    user: string; 
}
