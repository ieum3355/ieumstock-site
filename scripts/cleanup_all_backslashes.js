const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = 'c:/Users/sjm12/연습하기';
const DB_JS_PATH = path.join(PROJECT_ROOT, 'data/content_db.js');
const DB_JSON_PATH = path.join(PROJECT_ROOT, 'data/content_db.json');
const POSTS_DIR = path.join(PROJECT_ROOT, 'posts');

/**
 * 정규표현식을 사용하여 문자열 내의 백슬래시 오염을 정제합니다.
 */
function cleanContent(content) {
    let cleaned = content;

    // 1. 리터럴 "\\n" 을 실제 줄바꿈(또는 공백)으로 변경
    //    JSON.stringify 결과가 JS 리터럴로 들어갔을 때의 주범입니다.
    cleaned = cleaned.replace(/\\n/g, '\n');

    // 2. 리터럴 "\\\"" 또는 "\\'" 정제
    cleaned = cleaned.replace(/\\"/g, '"');
    cleaned = cleaned.replace(/\\'/g, "'");

    // 3. (옵션) 연속된 백슬래시가 남은 경우 정리
    // cleaned = cleaned.replace(/\\\\/g, '\\'); 

    return cleaned;
}

async function runCleanup() {
    console.log('🧹 Starting thorough cleanup of backslash pollution...');

    // 1. content_db.js 정제
    if (fs.existsSync(DB_JS_PATH)) {
        console.log(`Processing: ${DB_JS_PATH}`);
        const content = fs.readFileSync(DB_JS_PATH, 'utf8');
        const cleaned = cleanContent(content);
        if (content !== cleaned) {
            fs.writeFileSync(DB_JS_PATH, cleaned, 'utf8');
            console.log('✅ Cleaned content_db.js');
        } else {
            console.log('✨ content_db.js is already clean');
        }
    }

    // 2. content_db.json 정제
    if (fs.existsSync(DB_JSON_PATH)) {
        console.log(`Processing: ${DB_JSON_PATH}`);
        const content = fs.readFileSync(DB_JSON_PATH, 'utf8');
        const cleaned = cleanContent(content);
        if (content !== cleaned) {
            fs.writeFileSync(DB_JSON_PATH, cleaned, 'utf8');
            console.log('✅ Cleaned content_db.json');
        } else {
            console.log('✨ content_db.json is already clean');
        }
    }

    // 3. posts/*.html 정제
    if (fs.existsSync(POSTS_DIR)) {
        console.log(`Scanning: ${POSTS_DIR}`);
        const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.html'));
        let cleanedCount = 0;

        files.forEach(file => {
            const filePath = path.join(POSTS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const cleaned = cleanContent(content);
            if (content !== cleaned) {
                fs.writeFileSync(filePath, cleaned, 'utf8');
                cleanedCount++;
            }
        });
        console.log(`✅ Cleaned ${cleanedCount} HTML files in posts/`);
    }

    console.log('🎉 Cleanup process completed!');
}

runCleanup().catch(err => {
    console.error('❌ Error during cleanup:', err);
    process.exit(1);
});
