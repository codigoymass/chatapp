const fs = require('fs');
const path = 'data.json';

function read() {
    let file = fs.readFileSync(path);
    return JSON.parse(file);
}

function write(data) {
    fs.writeFileSync(path, JSON.stringify(data));
    return true;
}

module.exports = {read, write};