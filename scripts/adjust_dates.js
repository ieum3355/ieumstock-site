const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/content_db.js');
let content = fs.readFileSync(dbPath, 'utf8');

const startIndex = content.indexOf('const CONTENT_DB = {');
const endIndex = content.lastIndexOf('};');
const dbString = content.substring(startIndex + 'const CONTENT_DB = '.length, endIndex + 1);
const CONTENT_DB = eval('(' + dbString + ')');

console.log('📅 Adjusting dates for better distribution...\n');

// ID 23번을 1월 20일로 변경
const post23Index = CONTENT_DB.blog_posts.findIndex(post => post.id === 23);
if (post23Index !== -1) {
    CONTENT_DB.blog_posts[post23Index].date = '2026.01.20';
    CONTENT_DB.blog_posts[post23Index].publishDate = '2026-01-20';
    console.log('✅ Changed post ID 23 from 2026.01.21 to 2026.01.20');
}

// 날짜별 분포 확인
const dateDistribution = {};
CONTENT_DB.blog_posts.forEach(post => {
    if (post.date.startsWith('2026.01')) {
        dateDistribution[post.date] = (dateDistribution[post.date] || 0) + 1;
    }
});

console.log('\n📊 Updated date distribution:');
Object.keys(dateDistribution).sort().reverse().forEach(date => {
    console.log(`   ${date}: ${dateDistribution[date]} post(s)`);
});

// 파일 저장
const newContent = `const CONTENT_DB = ${JSON.stringify(CONTENT_DB, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONTENT_DB;
}
`;

fs.writeFileSync(dbPath, newContent, 'utf8');
console.log('\n✅ Successfully updated content_db.js');
