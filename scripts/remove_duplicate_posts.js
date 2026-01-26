const fs = require('fs');
const path = require('path');

// content_db.js 파일 읽기
const dbPath = path.join(__dirname, '../data/content_db.js');
let content = fs.readFileSync(dbPath, 'utf8');

// CONTENT_DB 객체 추출
const startIndex = content.indexOf('const CONTENT_DB = {');
const endIndex = content.lastIndexOf('};');
const dbString = content.substring(startIndex + 'const CONTENT_DB = '.length, endIndex + 1);

// JSON으로 파싱
const CONTENT_DB = eval('(' + dbString + ')');

console.log('Original blog posts count:', CONTENT_DB.blog_posts.length);

// ID 26-30번 포스트 삭제 (31번만 남김)
CONTENT_DB.blog_posts = CONTENT_DB.blog_posts.filter(post => {
    if (post.id >= 26 && post.id <= 30) {
        console.log(`Deleting post ID ${post.id}: ${post.title}`);
        return false;
    }
    return true;
});

console.log('New blog posts count:', CONTENT_DB.blog_posts.length);

// 파일 다시 작성
const newContent = `const CONTENT_DB = ${JSON.stringify(CONTENT_DB, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONTENT_DB;
}
`;

fs.writeFileSync(dbPath, newContent, 'utf8');
console.log('✅ Successfully removed duplicate posts (ID 26-30)');
console.log('✅ Kept post ID 31 as the latest post');
