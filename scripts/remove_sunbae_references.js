const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/content_db.js');

// Read the database file
let dbContent = fs.readFileSync(DB_PATH, 'utf8');

// Patterns to replace
const replacements = [
    // Remove "선배" from various contexts
    { pattern: /주식 선배로서/g, replacement: '' },
    { pattern: /선배로서/g, replacement: '' },
    { pattern: /선배의 /g, replacement: '' },
    { pattern: /선배가 주는 /g, replacement: '' },
    { pattern: /RSI 선배의/g, replacement: 'RSI' },
    { pattern: /볼린저 밴드 선배의/g, replacement: '볼린저 밴드' },

    // Remove first-person references
    { pattern: /제가 /g, replacement: '많은 투자자들이 ' },
    { pattern: /저는 /g, replacement: '경험상 ' },
    { pattern: /제 /g, replacement: '' },

    // Tone down arrogant expressions
    { pattern: /아시겠나요\?/g, replacement: '' },
    { pattern: /말이죠/g, replacement: '' },

    // Fix specific phrases
    { pattern: /\(선배의 한마디\)/g, replacement: '' },
    { pattern: /선배의 당부 \(진심입니다\)/g, replacement: '중요한 포인트' },
    { pattern: /선배의 호통을 기억하세요/g, replacement: '다음 사항을 기억하세요' },
    { pattern: /선배의 생존 지침/g, replacement: '생존 지침' },
    { pattern: /선배의 생존 수칙/g, replacement: '생존 수칙' },
    { pattern: /선배의 현실 충고/g, replacement: '현실 충고' },
    { pattern: /선배의 실전 솔루션/g, replacement: '실전 솔루션' },
    { pattern: /선배의 실전 체크포인트/g, replacement: '실전 체크포인트' },
    { pattern: /선배의 전략/g, replacement: '전략' },
    { pattern: /선배의 분산 투자 원칙/g, replacement: '분산 투자 원칙' },
    { pattern: /선배의 활용술/g, replacement: '활용 전략' },
    { pattern: /선배의 활용 노하우/g, replacement: '활용 노하우' },

    // Clean up double spaces and awkward phrasing
    { pattern: /  +/g, replacement: ' ' },
    { pattern: / ,/g, replacement: ',' },
    { pattern: / \./g, replacement: '.' },
];

// Apply all replacements
replacements.forEach(({ pattern, replacement }) => {
    dbContent = dbContent.replace(pattern, replacement);
});

// Write back to file
fs.writeFileSync(DB_PATH, dbContent, 'utf8');

console.log('Successfully removed "선배" references and first-person expressions from content_db.js');
