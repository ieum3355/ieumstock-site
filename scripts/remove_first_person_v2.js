const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/content_db.js');

console.log('🔧 Removing first-person expressions (v2)...\n');

// Read the file
let content = fs.readFileSync(DB_PATH, 'utf8');

// More precise replacements
const replacements = [
    // "나만" -> "혼자"
    { pattern: /나만\s+소외/g, replacement: '혼자 소외', desc: '나만 소외 → 혼자 소외' },

    // Other "나" patterns that are clearly first-person
    { pattern: /투자자가\s+사야/g, replacement: '투자할', desc: '투자자가 사야 → 투자할' },
    { pattern: /자신만의\s+확실한\s+근거가\s+생길/g, replacement: '확실한 근거가 생길', desc: '자신만의 확실한 근거 → 확실한 근거' },
];

let changeCount = 0;

// Apply all replacements
replacements.forEach(({ pattern, replacement, desc }) => {
    const matches = content.match(pattern);
    if (matches) {
        content = content.replace(pattern, replacement);
        changeCount += matches.length;
        console.log(`✅ ${desc} (${matches.length}회)`);
    }
});

// Write back to file
fs.writeFileSync(DB_PATH, content, 'utf8');

console.log(`\n💾 Total changes: ${changeCount}`);

if (changeCount > 0) {
    console.log('✨ Successfully removed additional first-person expressions!');
} else {
    console.log('✅ No additional first-person expressions found!');
}
