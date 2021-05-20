import { Document } from 'mongoose';

export default interface IWord extends Document {
    value: string;
    length: number;
    needFilter: boolean;
    isHanbang33: boolean;
    isHanbang32: boolean;
    isMiddle33: boolean;
    isMiddle32: boolean;
    isHidden: boolean;
    isValidated: boolean;
    date: Date;
    user: string; 
}
