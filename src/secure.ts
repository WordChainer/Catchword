import Const from './const.json';
import * as path from 'path';
import * as fs from 'fs';

export default () => {
    let options = {};

    options.key = fs.readFileSync(path.join(__dirname, '../certs', Const.SSL_OPTIONS.PRIVKEY));
    options.cert = fs.readFileSync(path.join(__dirname, '../certs', Const.SSL_OPTIONS.CERT));

    return options;
}
