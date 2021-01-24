import { model } from 'mongoose';
import IWord from '../interfaces/IWord';
import WordSchema from '../schemas/Word.schema';

const Word = model<IWord>('Word', WordSchema);

export default Word;
