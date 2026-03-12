const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
const lines = fs.readFileSync(DB_PATH, 'utf8').split('\n');

let fixedCount = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match a string property in JSON-like structure that spans the whole line: "key": "value"
    const match = line.match(/^(\s*"[^"]+"\s*:\s*")([^]*)(")(,?)(\s*\r?)$/);
    if (match) {
        let prefix = match[1];
        let inner = match[2];
        let suffix = match[3] + match[4] + match[5];

        // 1. Unescape all previously escaped quotes to prevent double escaping
        let unescaped = inner.replace(/\\"/g, '"');

        // 2. Escape all quotes
        let reEscaped = unescaped.replace(/"/g, '\\"');

        if (inner !== reEscaped) {
            lines[i] = prefix + reEscaped + suffix;
            fixedCount++;
        }
    }
}

fs.writeFileSync(DB_PATH, lines.join('\n'), 'utf8');
console.log(`Fixed inner quotes on ${fixedCount} lines in data/content_db.js`);
