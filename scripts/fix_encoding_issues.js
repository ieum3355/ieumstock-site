const fs = require('fs');
const path = require('path');

// content_db.js 파일 읽기
const dbPath = path.join(__dirname, '../data/content_db.js');
let content = fs.readFileSync(dbPath, 'utf8');

console.log('🔍 Searching for encoding issues...');

// 인코딩 문제 찾기 및 수정
const fixes = [
    { wrong: '역��', correct: '역사' },
    { wrong: '��를', correct: '사를' },
    { wrong: '과���', correct: '과거' },
    { wrong: '���', correct: '사' }
];

let fixCount = 0;
fixes.forEach(fix => {
    const regex = new RegExp(fix.wrong, 'g');
    const matches = content.match(regex);
    if (matches) {
        console.log(`Found ${matches.length} instances of "${fix.wrong}" -> fixing to "${fix.correct}"`);
        content = content.replace(regex, fix.correct);
        fixCount += matches.length;
    }
});

if (fixCount > 0) {
    fs.writeFileSync(dbPath, content, 'utf8');
    console.log(`✅ Fixed ${fixCount} encoding issues`);
} else {
    console.log('✅ No encoding issues found');
}
