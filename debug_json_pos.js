const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
const dbContent = fs.readFileSync(DB_PATH, 'utf8');

const match = dbContent.match(/"blog_posts":\s*(\[\s*\{[\s\S]*\}\s*\])/);
if (match) {
    const postsStr = match[1];
    const pos = 17707;
    console.log('--- Context around pos 17707 ---');
    const start = Math.max(0, pos - 50);
    const end = Math.min(postsStr.length, pos + 50);

    for (let i = start; i < end; i++) {
        const char = postsStr[i];
        const code = char.charCodeAt(0);
        const prefix = (i === pos) ? '>>>' : '   ';
        console.log(`${prefix} pos ${i}: '${char.replace(/\n/g, '\\n').replace(/\r/g, '\\r')}' (code: ${code})`);
    }
    console.log('--- End Context ---');
}
