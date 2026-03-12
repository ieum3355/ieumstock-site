const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/content_db.js');
let raw = fs.readFileSync(DB_PATH, 'utf8');

// The file starts with const CONTENT_DB = {
const startIdx = raw.indexOf('{');
const endIdx = raw.lastIndexOf('}');
const valStr = raw.substring(startIdx, endIdx + 1);

let data;
try {
    data = eval('(' + valStr + ')');
} catch (e) {
    console.error('Eval failed:', e);
    process.exit(1);
}

// 1. Update Market Brief
data.market_brief = "[2026년 02월 25일 시장 요약] 간밤 뉴욕 증시는 다우존스30산업평균지수가 전장보다 0.42% 하락한 39,282.33에 마감한 반면, 나스닥과 기술주 중심의 S&P 500 지수는 장중 랠리를 펼치는 등 혼조세를 보였습니다. 엔비디아가 어닝 서프라이즈 이후에도 소폭 조정받는 양상이 나타났으나 타 반도체 관련주에는 매수세가 이어졌습니다. 국내 증시도 전반적으로 외인 수급에 주목하며 차분한 흐름을 이어가고 있습니다. 밸류업 프로그램에 대한 기대감이 이어지고 있으니 실적과 주주환원이 명확한 종목을 중심으로 옥석 가리기가 필요한 시점입니다.";

// 2. Change date for post 53 (and 54 if it exists)
if (data.blog_posts && Array.isArray(data.blog_posts)) {
    data.blog_posts.forEach(post => {
        if (post.id === 53 || post.id === 54 || post.date === "2026.02.26") {
            post.date = "2026.02.25";
            post.publishDate = "2026-02-25";
        }
    });
}

// Write back
const finalCode = `const CONTENT_DB = ${JSON.stringify(data, null, 4)};\n\nif (typeof module !== 'undefined') module.exports = CONTENT_DB;`;
fs.writeFileSync(DB_PATH, finalCode, 'utf8');
console.log('Successfully updated dates and market brief for the 25th.');
