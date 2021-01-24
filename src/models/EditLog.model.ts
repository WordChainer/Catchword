import { model } from 'mongoose';
import IEditLog from '../interfaces/IEditLog';
import EditLogSchema from '../schemas/EditLog.schema';

const EditLog = model<IEditLog>('EditLog', EditLogSchema, 'editLogs');

export default EditLog;
