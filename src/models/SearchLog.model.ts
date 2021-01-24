import { model } from 'mongoose';
import ISearchLog from '../interfaces/ISearchLog';
import SearchLogSchema from '../schemas/SearchLog.schema';

const SearchLog = model<ISearchLog>('SearchLog', SearchLogSchema, 'searchLogs');

export default SearchLog;
