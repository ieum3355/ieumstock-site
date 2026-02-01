const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../data/content_db.js');
let content = fs.readFileSync(dbPath, 'utf8');
const newBrief = `[2026년 02월 01일 일요일 주간 브리핑] 1월의 마지막 금요일, 코스피는 2500선을 지켜내며 2월에 대한 희망의 불씨를 살렸습니다. 미 증시는 빅테크 실적 발표를 앞두고 관망세가 짙었지만, 우리 시장은 저가 매수세가 유입되며 하방 경직성을 보여주었습니다. 이번 주말에는 포트폴리오를 재정비하고, 다가올 2월의 기회(밸류업 프로그램, 금리 인하 기대감)를 선취매하는 전략이 필요합니다. 쉬면서도 시장의 맥을 놓치지 않는 현명한 투자자가 되시길 바랍니다.

* S&P 500: 6939.03
* 코스피: 2500 (변동 없음)
* 원/달러: 1445.17원`;

// Update market_brief
// Using regex to match specific pattern we saw in file
content = content.replace(/"market_brief":\s*(?:`[\s\S]*?`)/, `"market_brief": \`${newBrief}\``);

fs.writeFileSync(dbPath, content, 'utf8');
console.log('Updated market_brief');
