const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
const db = fs.readFileSync(DB_PATH, 'utf8');

let result = '';
let inString = false;
let escape = false;

for (let i = 0; i < db.length; i++) {
    const char = db[i];

    if (inString) {
        if (escape) {
            if (char === 'n' || char === 'r' || char === 't' || char === '"' || char === '\\') {
                result += '\\' + char;
            } else {
                result += '\\' + char;
            }
            escape = false;
        } else if (char === '\\') {
            escape = true;
        } else if (char === '"') {
            result += char;
            inString = false;
        } else if (char === '\n' || char === '\r') {
            result += '\\n';
        } else {
            result += char;
        }
    } else {
        result += char;
        if (char === '"') {
            inString = true;
        }
    }
}

fs.writeFileSync(DB_PATH, result, 'utf8');
console.log('✅ content_db.js fixed via char-by-char scanner.');
