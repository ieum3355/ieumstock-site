const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
let db = fs.readFileSync(DB_PATH, 'utf8');

// We want to target the content values specifically.
// Pattern: "content": "..."
// The value can span multiple lines and contain escaped quotes \"

// Let's use a simpler approach:
// Find all instances of "content": "
// Then find the corresponding closing " (the one not preceded by an odd number of backslashes)

let result = '';
let pos = 0;
const marker = '"content": "';

while (true) {
    let startIdx = db.indexOf(marker, pos);
    if (startIdx === -1) {
        result += db.substring(pos);
        break;
    }

    // Add everything before the marker
    result += db.substring(pos, startIdx + marker.length);

    // Now find the end of the string
    let searchPos = startIdx + marker.length;
    let endIdx = -1;

    while (true) {
        let quoteIdx = db.indexOf('"', searchPos);
        if (quoteIdx === -1) break; // Should not happen in valid-ish file

        // Check if this quote is escaped
        let backslashCount = 0;
        let k = quoteIdx - 1;
        while (k >= 0 && db[k] === '\\') {
            backslashCount++;
            k--;
        }

        if (backslashCount % 2 === 0) {
            // Not escaped (or backslash itself is escaped)
            endIdx = quoteIdx;
            break;
        } else {
            // Escaped quote, keep searching
            searchPos = quoteIdx + 1;
        }
    }

    if (endIdx !== -1) {
        let originalValue = db.substring(startIdx + marker.length, endIdx);
        // Replace actual newlines with \\n
        let fixedValue = originalValue.replace(/\r/g, '').replace(/\n/g, '\\n');
        result += fixedValue;
        pos = endIdx;
    } else {
        // Fallback
        pos = startIdx + marker.length;
    }
}

fs.writeFileSync(DB_PATH, result, 'utf8');
console.log('✅ content_db.js fixed with robust scanner.');
