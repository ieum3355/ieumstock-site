const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
let raw = fs.readFileSync(DB_PATH, 'utf8');

// The user is seeing literal '\\' in the text, which means in the file it probably looks like '\\\\' or '\\ \n' etc.
// In the view_file, we saw `</p>\\\n\\\n<h3>ROE,`. This means it's a backslash followed by a newline `\n`.
// We should replace `\\\n` with `\n` to remove the backslashes.
let newRaw = raw.replace(/\\\\n/g, '\\n');
fs.writeFileSync(DB_PATH, newRaw, 'utf8');
console.log('Fixed double backslashes in data/content_db.js');
