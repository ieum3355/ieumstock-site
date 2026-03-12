const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
let raw = fs.readFileSync(DB_PATH, 'utf8');

console.log('Original length:', raw.length);

// Fix literal newlines in "content": "..."
// This regex looks for the content key and its value, 
// matching non-greedily until it finds a quote followed by a comma or closing brace on a new line.
const fixed = raw.replace(/"content":\s*"([\s\S]*?)"(?=\s*[,}\n\r])/g, (match, p1) => {
    // Replace literal newlines with escaped \n
    const escaped = p1.replace(/\r/g, '').replace(/\n/g, '\\n');
    return `"content": "${escaped}"`;
});

// Also fix "desc": "..." and "question": "..." if they have newlines
const final = fixed.replace(/"(desc|question|problem|solution)":\s*"([\s\S]*?)"(?=\s*[,}\n\r])/g, (match, p1, p2) => {
    const escaped = p2.replace(/\r/g, '').replace(/\n/g, '\\n');
    return `"${p1}": "${escaped}"`;
});

fs.writeFileSync(DB_PATH, final, 'utf8');
console.log('Fixed length:', final.length);
console.log('✅ Emergency format fix completed.');
