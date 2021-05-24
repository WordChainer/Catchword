import { Console } from 'console';
import { inspect, types } from 'util';
import dayjs from 'dayjs';

const inspectOptions = {
    showHidden: true,
    compact: false,
    depth: null,
    colors: true
};

export default class Logger extends Console {
    static readonly dateFormat = 'HH:mm:ss';

    static parse(data: any): string {
        return data && types.isNativeError(data)
            ? data.message || data.stack || String(data)
            : Array.isArray(data)
                ? data.map(Logger.parse).join(', ')
                : data !== null && typeof data === 'object'
                    ? '\n' + inspect(data, inspectOptions)
                    : String(data);
    }

    constructor() {
        super(process.stdout, process.stderr);
    }

    private writeLog(data: any, type: string = 'log') {
        data = Logger.parse(data);

        super[type](Logger.PAINTS[type], `[${this.timestamp}] ${data}`);
    }

    public get timestamp(): string {
        return dayjs().add(9, 'h').format(Logger.dateFormat);
    }

    public log(...data: any[]) {
        for (let message of data) {
            this.writeLog(message, 'log');
        }
    }

    public error(...data: any[]) {
        for (let message of data) {
            this.writeLog(message, 'error');
        }
    }

    public warn(...data: any[]) {
        for (let message of data) {
            this.writeLog(message, 'warn');
        }
    }
}

Logger.PAINTS = {
    log: '\x1b[42m%s\x1b[0m',
    error: '\x1b[41m%s\x1b[0m',
    warn: '\x1b[43m\x1b[30m%s\x1b[0m'
};
