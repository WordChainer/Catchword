import { Document } from 'mongoose';

export default interface IWord extends Document {
    value: string;
    length: number;
    needFilter: boolean;
    isHidden: boolean;
    isValidated: boolean;
    date: Date;
    user: string; 
}
