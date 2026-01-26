const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/content_db.js');

console.log('🔧 Removing first-person expressions from blog posts...\n');

// Read the file
let content = fs.readFileSync(DB_PATH, 'utf8');

// Define replacements - only first-person expressions, NOT financial terms
const replacements = [
    // "저는" patterns
    { pattern: /저는\s+/g, replacement: '경험상 ' },
    { pattern: /저는/g, replacement: '일반적으로' },

    // "제가" patterns
    { pattern: /제가\s+/g, replacement: '투자자들이 ' },
    { pattern: /제가/g, replacement: '투자자가' },

    // "제" patterns (but NOT in financial terms like "제2의")
    { pattern: /제\s+소중한/g, replacement: '소중한' },
    { pattern: /제\s+가슴/g, replacement: '가슴' },
    { pattern: /제\s+주머니/g, replacement: '주머니' },

    // "나" patterns (but be careful with "나타나다", "나오다" etc)
    { pattern: /내가\s+/g, replacement: '투자자가 ' },
    { pattern: /나만의/g, replacement: '자신만의' },
    { pattern: /나\s+자신/g, replacement: '자신' },

    // "선배" patterns
    { pattern: /선배로서\s+/g, replacement: '' },
    { pattern: /주식\s+선배/g, replacement: '투자 전문가' },
    { pattern: /선배의\s+/g, replacement: '' },

    // Specific phrase replacements
    { pattern: /많은 투자자들이 제시하는/g, replacement: '다음과 같은' },
    { pattern: /경험상\s+경험상/g, replacement: '경험상' }, // Remove duplicates
    { pattern: /일반적으로\s+일반적으로/g, replacement: '일반적으로' },
];

let changeCount = 0;

// Apply all replacements
replacements.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
        content = content.replace(pattern, replacement);
        changeCount += matches.length;
        console.log(`✅ Replaced: ${pattern} → "${replacement}" (${matches.length} times)`);
    }
});

// Write back to file
fs.writeFileSync(DB_PATH, content, 'utf8');

console.log(`\n💾 Total changes: ${changeCount}`);
console.log('✨ Successfully removed first-person expressions!');
