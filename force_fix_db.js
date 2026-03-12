const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
const raw = fs.readFileSync(DB_PATH, 'utf8');

let result = '';
let inString = false;
let escape = false;

for (let i = 0; i < raw.length; i++) {
    const c = raw[i];

    if (inString) {
        if (escape) {
            result += c;
            escape = false;
        } else if (c === '\\') {
            result += c;
            escape = true;
        } else if (c === '"') {
            result += c;
            inString = false;
        } else if (c === '\n') {
            // Literal newline inside string! Escape it.
            result += '\\n';
        } else if (c === '\r') {
            // Skip CR
        } else {
            result += c;
        }
    } else {
        result += c;
        if (c === '"') {
            inString = true;
        }
    }
}

fs.writeFileSync(DB_PATH, result, 'utf8');
console.log('✅ State-machine fix completed successfully.');
