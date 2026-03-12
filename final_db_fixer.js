const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
const raw = fs.readFileSync(DB_PATH, 'utf8');

// The file starts with const CONTENT_DB = {
const startIdx = raw.indexOf('{');
const endIdx = raw.lastIndexOf('}');
if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find start/end of object');
    process.exit(1);
}

const valStr = raw.substring(startIdx, endIdx + 1);

// Scanner to find strings and fix them
let result = '';
let inString = false;
let quoteChar = '';
let escape = false;

for (let i = 0; i < valStr.length; i++) {
    const c = valStr[i];

    if (inString) {
        if (escape) {
            // Whatever char follows \, we keep it as is in the internal representation
            result += c;
            escape = false;
        } else if (c === '\\') {
            result += c;
            escape = true;
        } else if (c === quoteChar) {
            result += c;
            inString = false;
        } else if (c === '\n' || c === '\r') {
            // Literal newline in string! In JS source with double-quotes, this is a syntax error.
            // We convert it to the characters \ and n.
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

// Now result should be a valid JS object literal string.
let data;
try {
    data = eval('(' + result + ')');
    console.log('✅ Eval succeeded!');
} catch (e) {
    console.error('❌ Eval failed:', e.message);
    // Find where it failed
    process.exit(1);
}

// Deep clean the data to remove any remaining "backslash pollution"
// if data strings have literal backslash + n, they will be "\n" (two chars) in the object.
// We want them to be actual newlines in memory so JSON.stringify can handle them.
function cleanData(obj) {
    if (typeof obj === 'string') {
        // If the string contains the sequence \ then n
        return obj.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    } else if (Array.isArray(obj)) {
        return obj.map(cleanData);
    } else if (obj !== null && typeof obj === 'object') {
        const cleaned = {};
        for (let key in obj) {
            cleaned[key] = cleanData(obj[key]);
        }
        return cleaned;
    }
    return obj;
}

const cleanedData = cleanData(data);

// Final serialization
const finalCode = `const CONTENT_DB = ${JSON.stringify(cleanedData, null, 4)};\n\nif (typeof module !== 'undefined') module.exports = CONTENT_DB;`;
fs.writeFileSync(DB_PATH, finalCode, 'utf8');
console.log('🚀 DB REPAIRED AND NORMALIZED.');
