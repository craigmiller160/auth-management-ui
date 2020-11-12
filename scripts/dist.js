// TODO this probably needs to be deleted... or moved to config lib

const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const cwd = process.cwd();
const version = packageJson.version;
const name = packageJson.name.replace('@craigmiller160/', '');

const outputDir = path.resolve(cwd, 'deploy/build');
if (fs.existsSync(outputDir)) {
    fs.rmdirSync(outputDir, { recursive: true });
}

fs.mkdirSync(outputDir);

const output = fs.createWriteStream(path.resolve(outputDir, `${name}-${version}.zip`));
const archive = archiver('zip');

archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
        console.log(err);
    } else {
        throw err;
    }
});
archive.on('error', (err) => {
    throw err;
});
archive.pipe(output);

const files = fs.readdirSync(path.resolve(cwd, 'build'));
files.forEach((file) => {
    const stat = fs.lstatSync(path.resolve(cwd, 'build', file));
    if (stat.isDirectory()) {
        archive.directory(path.resolve(cwd, 'build', file), file);
    } else {
        archive.file(path.resolve(cwd, 'build', file), { name: file });
    }
});

archive.finalize();
