const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
const raw = fs.readFileSync(DB_PATH, 'utf8');

try {
    // Try to evaluate the file to finding syntax errors
    const script = raw.replace('var CONTENT_DB =', 'return');
    new Function(script)();
    console.log('✅ No syntax errors found.');
} catch (e) {
    console.error('❌ Syntax Error found:');
    console.error(e.message);
    if (e.stack) {
        // Try to extract line number from stack
        const match = e.stack.match(/<anonymous>:(\d+):(\d+)/);
        if (match) {
            const line = parseInt(match[1]);
            const col = parseInt(match[2]);
            console.error(`Position: Line ${line}, Col ${col}`);

            const lines = raw.split('\n');
            if (lines[line - 1]) {
                console.error('Surrounding text:');
                console.error(lines[line - 1]);
                console.error(' '.repeat(col - 1) + '^');
            }
        }
    }
}
