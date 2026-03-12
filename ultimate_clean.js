const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
const raw = fs.readFileSync(DB_PATH, 'utf8');

// The prefix 'const CONTENT_DB = ' and suffix ';'
const prefix = 'const CONTENT_DB = ';
const startIdx = raw.indexOf(prefix) + prefix.length;
const endIdx = raw.lastIndexOf(';');
const valStr = raw.substring(startIdx, endIdx).trim();

// Now, valStr might have literal newlines in double-quoted strings.
// To make it eval-able, we can't just replace all \n with \\n because it breaks the formatting.
// But we can use a more clever approach: Replace all \n with a unique marker, then fix it.

// Actually, let's use the char-by-char scanner to ONLY escape newlines INSIDE strings.
function escapeNewlinesInStrings(s) {
    let result = '';
    let inString = false;
    let quoteChar = '';
    let escape = false;
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
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
            } else if (c === '\n' || c === '\r') {
                result += '\\n';
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
    return result;
}

const escapedValStr = escapeNewlinesInStrings(valStr);

let data;
try {
    data = eval('(' + escapedValStr + ')');
    console.log('✅ Successfully loaded data via eval.');
} catch (e) {
    console.error('❌ Eval still failed:', e.message);
    process.exit(1);
}

// Clean backslashes if any
function deepClean(obj) {
    if (typeof obj === 'string') {
        // Replace literal \n (backslash then n) with actual newline if you want... 
        // BUT the user said they see backslashes. If they see \n, it's because it's double escaped.
        // So we reduce \\n to \n.
        return obj.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    } else if (Array.isArray(obj)) {
        return obj.map(deepClean);
    } else if (obj !== null && typeof obj === 'object') {
        const result = {};
        for (let key in obj) {
            result[key] = deepClean(obj[key]);
        }
        return result;
    }
    return obj;
}

const cleaned = deepClean(data);

// Write back. JSON.stringify handles everything perfectly.
const finalCode = `const CONTENT_DB = ${JSON.stringify(cleaned, null, 4)};\n\nif (typeof module !== 'undefined') module.exports = CONTENT_DB;`;
fs.writeFileSync(DB_PATH, finalCode, 'utf8');
console.log('✨ content_db.js is now PERFECT.');
