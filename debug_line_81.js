const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
const lines = fs.readFileSync(DB_PATH, 'utf8').split('\n');
const line81 = lines[80]; // 0-indexed

console.log('Line 81 text:', line81);
console.log('Line 81 hex:');
let hex = '';
for (let i = 0; i < line81.length; i++) {
    hex += line81.charCodeAt(i).toString(16).padStart(2, '0') + ' ';
}
console.log(hex);
