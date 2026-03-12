const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
const dbCode = fs.readFileSync(DB_PATH, 'utf8');

// The file looks like: const CONTENT_DB = { ... };
// We want to extract the object part.
let objectStr = dbCode.substring(dbCode.indexOf('{'), dbCode.lastIndexOf('}') + 1);

let data;
try {
    // Wrap in parens to make it an expression
    data = eval('(' + objectStr + ')');
} catch (e) {
    console.error('❌ Eval failed:', e.message);
    // If it has literal newlines, eval might still fail. 
    // Let's try to fix literal newlines FIRST before eval.
    const semiFixed = objectStr.replace(/\n/g, '\\n').replace(/\r/g, '');
    // Wait, this might be too aggressive.
    process.exit(1);
}

// Clean the data
function clean(obj) {
    if (typeof obj === 'string') {
        // Here we fix the "backslash pollution"
        // If it has \\n (which became \n in the object), we keep it as \n.
        // But if it has literal \n (backslash then n), it would have been \\n in the source.

        // Wait, if the user sees literal \n on the site, it means the string in memory has backslash then n.
        // So we want to replace the sequence [backslash, n] with [newline].
        return obj.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    } else if (Array.isArray(obj)) {
        return obj.map(clean);
    } else if (obj !== null && typeof obj === 'object') {
        for (let key in obj) {
            obj[key] = clean(obj[key]);
        }
    }
    return obj;
}

const cleanedData = clean(data);

// Write back. We use JSON.stringify(..., null, 4) which will produce proper \n escapes.
const newContent = `const CONTENT_DB = ${JSON.stringify(cleanedData, null, 4)};\n\nif (typeof module !== 'undefined') module.exports = CONTENT_DB;`;

fs.writeFileSync(DB_PATH, newContent, 'utf8');
console.log('✅ content_db.js cleaned and re-serialized safely.');
