const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
const raw = fs.readFileSync(DB_PATH, 'utf8');

// We want to find "content": "..."
// We will replace the value part with a properly JSON.stringified version.

let result = '';
let pos = 0;
const marker = '"content": "';

while (true) {
    let startIdx = raw.indexOf(marker, pos);
    if (startIdx === -1) {
        result += raw.substring(pos);
        break;
    }

    // Add text before the marker
    result += raw.substring(pos, startIdx + marker.length);

    // Now find the end of the string.
    // BUT! Since the original file is BROKEN (it has unescaped quotes), 
    // we must find the end of the value block, which usually ends with ", or "
    // followed by a newline and } or {

    let searchPos = startIdx + marker.length;
    let endIdx = -1;

    // Look for the next patterns: 
    // 1. " followed by , 
    // 2. " followed by newline and }
    const patterns = ['",', '"\r\n\t\t\t\t}', '"\n\t\t\t\t}', '"\r\n                }', '"\n                }'];

    let earliestPattern = -1;
    let foundPattern = '';

    for (let p of patterns) {
        let idx = raw.indexOf(p, searchPos);
        if (idx !== -1 && (earliestPattern === -1 || idx < earliestPattern)) {
            earliestPattern = idx;
            foundPattern = p;
        }
    }

    if (earliestPattern !== -1) {
        let originalContent = raw.substring(startIdx + marker.length, earliestPattern);
        // Normalize the content: 
        // - Replace literal newlines with \n
        // - Handle double backslashes
        // - The easiest way: let JSON.stringify handle it.
        // We want to treat originalContent as a RAW string.

        let cleanedContent = originalContent.replace(/\\+"/g, '"'); // Unescape first to be clean
        cleanedContent = cleanedContent.replace(/\\n/g, '\n'); // Normalize existing \n sequences

        // Now re-serialize using JSON.stringify
        let safeValue = JSON.stringify(cleanedContent);
        // Remove the surrounding quotes added by JSON.stringify because we already have them in result
        result += safeValue.substring(1, safeValue.length - 1);

        pos = earliestPattern;
    } else {
        // Fallback
        pos = startIdx + marker.length;
    }
}

// Add module.exports for build_static.js
if (!result.includes('module.exports')) {
    result += "\n\nif (typeof module !== 'undefined') module.exports = CONTENT_DB;";
}

fs.writeFileSync(DB_PATH, result, 'utf8');
console.log('💎 content_db.js FIXED and NORMALIZED with Master Script.');
