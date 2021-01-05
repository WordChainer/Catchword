const express = require('express');
const router = express.Router();
const exec = require('child_process').execSync;
const zip = new require('node-zip')();
const fs = require('fs');
const cwd = process.cwd();

router.get('/', (req, res) => {
    if (!res.locals.isAdmin) {
        return res.send('접근 권한이 없습니다!');
    }

    let id = Math.random().toString(36).substring(7),
        target = `${cwd}/words_${id}.zip`;

    exec(`bash ${cwd}/exportDB.sh`, { stdio: 'pipe' });

    zip.file('words.txt', fs.readFileSync(cwd + '/words.txt'));
    zip.file('words2.txt', fs.readFileSync(cwd + '/words2.txt'));

    fs.writeFileSync(target, zip.generate({ 
        base64:false,
        compression:'DEFLATE'
    }), 'binary');

    res.download(target, err => {
        if (err) {
            console.log(err);
        }

        exec(`rm -f ${cwd}/words*`);
    });
});

module.exports = router;
