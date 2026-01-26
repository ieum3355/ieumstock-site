const fs = require('fs');
const path = require('path');

// 중복 제거할 ID 목록
const duplicateIds = [25, 31, 32, 33, 34, 35];

// content_db.js 파일 경로
const contentDbPath = path.join(__dirname, '..', 'data', 'content_db.js');

// 파일 읽기
let content = fs.readFileSync(contentDbPath, 'utf8');

// CONTENT_DB 객체 추출
const dbMatch = content.match(/const CONTENT_DB = ({[\s\S]*?});[\s\S]*?if \(typeof module/);
if (!dbMatch) {
    console.error('❌ CONTENT_DB를 찾을 수 없습니다.');
    process.exit(1);
}

// JSON 파싱을 위해 객체 부분만 추출
const dbString = dbMatch[1];
const CONTENT_DB = eval(`(${dbString})`);

console.log(`📊 현재 블로그 포스트 수: ${CONTENT_DB.blog_posts.length}`);
console.log(`🗑️  삭제할 ID: ${duplicateIds.join(', ')}`);

// 중복 ID 제거
const originalLength = CONTENT_DB.blog_posts.length;
CONTENT_DB.blog_posts = CONTENT_DB.blog_posts.filter(post => !duplicateIds.includes(post.id));
const removedCount = originalLength - CONTENT_DB.blog_posts.length;

console.log(`✅ ${removedCount}개의 중복 포스트 제거 완료`);
console.log(`📊 남은 블로그 포스트 수: ${CONTENT_DB.blog_posts.length}`);

// 파일에 다시 쓰기
const newContent = `const CONTENT_DB = ${JSON.stringify(CONTENT_DB, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONTENT_DB;
}
`;

fs.writeFileSync(contentDbPath, newContent, 'utf8');
console.log('💾 content_db.js 파일 업데이트 완료');

// 제거된 포스트 목록 출력
console.log('\n🗑️  제거된 포스트:');
duplicateIds.forEach(id => {
    console.log(`   - ID ${id}`);
});
