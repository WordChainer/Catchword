import { Router, Request, Response } from 'express';
import { execSync as exec } from 'child_process';
import AdmZip from 'adm-zip';
import * as path from 'path';
import * as fs from 'fs';
import checkAdmin from '../utils/checkAdmin';

const router = Router();
const zip = new AdmZip();
const cwd = process.cwd();

router.all('*', checkAdmin);
router.get('/', (req: Request, res: Response) => {
    let id = Math.random().toString(36).substring(7),
        target = path.join(cwd, 'words_' + id + '.zip');

    exec('bash ' + path.join(cwd, 'exportDB.sh'), { stdio: 'pipe' });

    ['words.txt', 'words2.txt'].forEach((file: string) => {
        file = path.join(cwd, file);

        fs.writeFileSync(file, fs.readFileSync(file, 'utf-8').replace(/\n/g, '\r\n'));
        zip.addLocalFile(file);
    });

    zip.writeZip(target);
    res.download(target, (err: Error) => {
        if (err) {
            console.log(err);
        }

        exec('rm -f ' + path.join(cwd, 'words*'));
    });
});

export default router;
