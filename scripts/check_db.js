const fs = require('fs');
const path = require('path');

try {
    const dbPath = path.join(__dirname, '../data/content_db.js');
    console.log(`Checking ${dbPath}...`);
    const content = require(dbPath);
    console.log("✅ CONTENT_DB satisfies syntax check.");
    console.log("Keys:", Object.keys(content));
    if (content.market_brief) console.log("Market Brief:", content.market_brief.substring(0, 50) + "...");
} catch (e) {
    console.error("❌ Error loading content_db.js:");
    console.error(e);
    process.exit(1);
}
