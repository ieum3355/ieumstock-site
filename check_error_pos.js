const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
const content = fs.readFileSync(DB_PATH, 'utf8');

const dbMatch = content.match(/"blog_posts":\s*(\[\s*\{[\s\S]*\}\s*\])/);
if (dbMatch) {
    const postsStr = dbMatch[1];
    const pos = 17707;
    console.log('Error around position:', pos);
    console.log('--- Context ---');
    console.log(postsStr.substring(pos - 100, pos + 100));
    console.log('--- End Context ---');
}
