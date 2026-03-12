const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data/content_db.js');
const db = fs.readFileSync(DB_PATH, 'utf8');

const match = db.match(/"blog_posts":\s*(\[\s*\{[\s\S]*\}\s*\])/);
if (match) {
    const postsStr = match[1];
    // Try to parse posts one by one or in blocks to see where it fails
    console.log('Total length of posts string:', postsStr.length);

    // Attempt to parse the whole thing first
    try {
        JSON.parse(postsStr);
        console.log('✅ Parsed successfully in diagnostic script!');
    } catch (e) {
        console.error('❌ Parse failed:', e.message);
        const matchPos = e.message.match(/position (\d+)/);
        if (matchPos) {
            const p = parseInt(matchPos[1]);
            console.log('Error around position:', p);
            console.log('Context:', JSON.stringify(postsStr.substring(p - 20, p + 20)));
        }
    }
}
