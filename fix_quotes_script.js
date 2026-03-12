const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
let raw = fs.readFileSync(DB_PATH, 'utf8');

// Replace unescaped quotes in specific HTML attributes
raw = raw.replace(/class="([^"]*)"/g, 'class=\\"$1\\"');
raw = raw.replace(/style="([^"]*)"/g, 'style=\\"$1\\"');
raw = raw.replace(/href="([^"]*)"/g, 'href=\\"$1\\"');

fs.writeFileSync(DB_PATH, raw, 'utf8');
console.log('Fixed unescaped quotes in data/content_db.js');
