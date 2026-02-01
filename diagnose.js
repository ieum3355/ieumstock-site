const fs = require('fs');

function checkFile(path) {
    console.log(`Checking ${path}...`);
    try {
        const content = fs.readFileSync(path, 'utf8');
        // Syntactic check using Function constructor
        new Function(content);
        console.log(`✅ ${path}: Syntax OK`);
    } catch (e) {
        console.error(`❌ ${path}: SYNTAX ERROR`);
        console.error(e.message);
        // Try to show context
        if (e.stack) {
            const match = e.stack.match(/:(\d+):(\d+)/);
            if (match) {
                const line = parseInt(match[1]);
                console.log(`Error location approx line: ${line}`);
            }
        }
    }
    console.log('---');
}

checkFile('app.js');
checkFile('data/content_db.js');
checkFile('scripts/check_db.js'); // Check this too
