const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
const db = fs.readFileSync(DB_PATH, 'utf8');

let pos = 0;
let count = 0;
while ((pos = db.indexOf('="', pos)) !== -1) {
    let backslashes = 0;
    let k = pos - 1;
    while (k >= 0 && db[k] === '\\') {
        backslashes++;
        k--;
    }
    if (backslashes % 2 === 0) {
        console.log(`❌ Unescaped =" at pos ${pos}: ...${db.substring(pos - 20, pos + 20).replace(/\n/g, '\\n')}...`);
        count++;
    }
    pos += 2;
}
console.log(`Total unescaped =" found: ${count}`);
