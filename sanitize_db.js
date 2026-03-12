const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
let raw = fs.readFileSync(DB_PATH, 'utf8');

// Remove potential BOM or weird zero-width characters
raw = raw.replace(/[\u200B-\u200D\uFEFF]/g, '');

// Ensure literal newlines inside strings are escaped
let result = '';
let inString = false;
let quoteChar = '';
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
        } else if (c === quoteChar) {
            result += c;
            inString = false;
        } else if (c === '\n') {
            result += '\\n';
        } else if (c === '\r') {
            // skip
        } else {
            result += c;
        }
    } else {
        result += c;
        if (c === '"' || c === "'") {
            inString = true;
            quoteChar = c;
        }
    }
}

fs.writeFileSync(DB_PATH, result, 'utf8');
console.log('✅ Sanitization completed.');
