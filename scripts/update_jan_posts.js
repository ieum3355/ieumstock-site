const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/content_db.js');

// Read current content
let content = fs.readFileSync(DB_PATH, 'utf8');

// 1. Update market briefing to be objective
const newMarketBrief = "코스피는 전일 대비 0.76% 상승한 4990.07로 마감했습니다. 외국인은 순매수세를 보였으며, 기관은 소폭 순매도를 기록했습니다. 미국 S&P 500 지수는 0.03% 상승했고, 나스닥은 0.28% 상승 마감했습니다. 원/달러 환율은 1445.88원으로 전일 대비 1.25% 하락했습니다.";

content = content.replace(
    /"market_brief":\s*"[^"]*"/,
    `"market_brief": "${newMarketBrief}"`
);

// 2. Replace Jan 23 post (ID 31) - Different topic
const jan23NewPost = {
    "id": 31,
    "title": "[리스크 관리] 손절매는 패배가 아닙니다. 다음 기회를 위한 현명한 선택입니다.",
    "date": "2026.01.23",
    "publishDate": "2026-01-23",
    "content": "<h3>손실을 인정하지 못하는 투자자는 결국 더 큰 손실을 맞이합니다</h3>\\n<p>많은 투자자들이 손절매를 '패배'로 생각합니다. 하지만 이는 잘못된 인식입니다. 손절매는 <strong>더 큰 손실을 막고 자본을 보존하기 위한 전략적 선택</strong>입니다. 시장에서 100% 승률을 기록하는 투자자는 없습니다. 중요한 것은 손실을 최소화하고 수익을 극대화하는 것입니다.</p>\\n\\n<h3>본론 1 - 시장의 냉혹한 현실: 물타기는 희망이 아니라 집착입니다</h3>\\n<p>주가가 하락하면 많은 투자자들이 평단가를 낮추기 위해 추가 매수, 즉 '물타기'를 합니다. 하지만 <strong>근거 없는 물타기는 매우 위험</strong>합니다. 기업의 펀더멘털이 훼손되었거나, 산업 전망이 악화된 상황에서 물타기를 하는 것은 구멍 난 배에 계속 물을 퍼붓는 것과 같습니다.</p>\\n<p>예를 들어, 특정 기업이 회계 부정이나 경영진 비리로 주가가 폭락했다고 가정해봅시다. 이런 상황에서 '싸게 샀다'며 물타기를 하는 것은 매우 위험한 행동입니다. 기업의 신뢰가 무너지면 주가 회복은 매우 어렵습니다. 오히려 상장폐지 위험까지 있을 수 있습니다.</p>\\n<p>물타기를 고려하기 전에 반드시 확인해야 할 사항들이 있습니다:</p>\\n<ul>\\n  <li><strong>하락 원인 분석:</strong> 일시적인 시장 조정인지, 기업의 펀더멘털 악화인지 구분해야 합니다.</li>\\n  <li><strong>산업 전망:</strong> 해당 산업이 성장 중인지, 쇠퇴 중인지 확인해야 합니다.</li>\\n  <li><strong>재무 건전성:</strong> 부채비율, 현금흐름, 영업이익 추이를 점검해야 합니다.</li>\\n</ul>\\n\\n<h3>본론 2 - 차트는 거짓말 안 합니다: 손절 타이밍을 놓치지 마세요</h3>\\n<p>기술적 분석 관점에서 손절매 타이밍은 매우 중요합니다. 일반적으로 다음과 같은 상황에서는 손절을 고려해야 합니다:</p>\\n<ul>\\n  <li><strong>주요 지지선 붕괴:</strong> 장기 이동평균선(60일선, 120일선)을 하향 돌파하면 추세 전환 신호입니다.</li>\\n  <li><strong>거래량 동반 하락:</strong> 대량 거래와 함께 주가가 하락하면 매도세가 강하다는 의미입니다.</li>\\n  <li><strong>음봉 연속 출현:</strong> 장대 음봉이 연속으로 나타나면 하락 추세가 강화되고 있다는 신호입니다.</li>\\n</ul>\\n<p>많은 투자자들이 '조금만 더 기다리면 오르겠지'라는 희망 회로를 돌립니다. 하지만 차트가 명확한 하락 신호를 보내고 있다면, 감정을 배제하고 냉정하게 손절해야 합니다. <strong>손절은 빠를수록 좋습니다.</strong> -5%에서 손절할 것을 -10%, -20%까지 버티다가 결국 -30%, -50%의 손실을 보게 됩니다.</p>\\n\\n<h3>본론 3 - 실전 솔루션: 손절매 원칙 세우기</h3>\\n<p>성공적인 투자를 위해서는 명확한 손절매 원칙이 필요합니다. 다음과 같은 방법을 추천합니다:</p>\\n<ul>\\n  <li><strong>비율 손절:</strong> 매수가 대비 -5% 또는 -10% 하락 시 무조건 손절합니다. 감정을 배제하고 기계적으로 실행해야 합니다.</li>\\n  <li><strong>기술적 손절:</strong> 주요 지지선(이동평균선, 추세선) 이탈 시 손절합니다.</li>\\n  <li><strong>시간 손절:</strong> 일정 기간(예: 3개월) 동안 수익이 나지 않으면 손절하고 다른 기회를 찾습니다.</li>\\n  <li><strong>펀더멘털 손절:</strong> 기업의 실적 악화, 악재 발생 시 즉시 손절합니다.</li>\\n</ul>\\n<p>손절 후에는 반드시 <strong>매매 일지를 작성</strong>해야 합니다. 왜 손실이 발생했는지, 어떤 실수를 했는지 기록하고 분석해야 같은 실수를 반복하지 않습니다. 손절은 실패가 아니라 <strong>학습의 기회</strong>입니다.</p>\\n<p>또한, 손절 후에는 즉시 다른 종목에 투자하지 마세요. 감정이 격해진 상태에서 내린 결정은 대부분 잘못된 결정입니다. 충분히 휴식을 취하고, 냉정함을 되찾은 후에 다음 투자를 계획하세요.</p>\\n\\n<h3>결론 및 면책조항: 손절은 생존 전략입니다</h3>\\n<p>손절매는 패배가 아닙니다. 오히려 <strong>시장에서 살아남기 위한 필수 전략</strong>입니다. 손실을 인정하지 못하고 계속 버티다가 원금을 모두 잃는 투자자들을 많이 봤습니다. 작은 손실은 감수하되, 큰 손실은 절대 피해야 합니다. 이것이 장기적으로 성공하는 투자자의 비결입니다.</p>\\n<p><strong>이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다.</strong> 손절매는 쉽지 않지만, 반드시 필요한 투자 기술입니다. 오늘부터 손절매 원칙을 세우고 철저히 지키시기 바랍니다.</p>\\n<div class=\\\"internal-links\\\" style=\\\"margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid var(--accent-color);\\\"><h4 style=\\\"margin-top: 0; margin-bottom: 1rem;\\\">💡 함께 읽어보면 좋은 글</h4><ul style=\\\"list-style: none; padding: 0; margin: 0;\\\"><li style=\\\"margin-bottom: 0.5rem;\\\"><a href=\\\"blog.html?id=18\\\" style=\\\"color: var(--accent-color); text-decoration: none; font-weight: 600;\\\">🔗 [따끔한 질책] '물타기'면 다 되는 줄 아십니까? 그건 자살 행위입니다.</a></li><li style=\\\"margin-bottom: 0.5rem;\\\"><a href=\\\"blog.html?id=21\\\" style=\\\"color: var(--accent-color); text-decoration: none; font-weight: 600;\\\">🔗 [마인드셋] 매매 일지 안 쓰는 투자자는 같은 실수를 반복하며 돈을 잃습니다.</a></li></ul></div>"
};

// 3. Replace Jan 24 post (ID 32) - Different topic  
const jan24NewPost = {
    "id": 32,
    "title": "[종목 발굴] 당신이 매일 시키는 야식과 커피, 거기에 텐배거의 힌트가 있습니다.",
    "date": "2026.01.24",
    "publishDate": "2026-01-24",
    "content": "<h3>모르는 기업에 투자하는 건 카지노에서 룰렛 돌리는 거랑 다를 게 없습니다.</h3>\\n<p>반도체, 바이오, 2차전지... 어렵죠? 용어도 모르겠고 공정은 더 복잡합니다. 그럼 그런 거 공부하지 마세요. 전설적인 투자자 피터 린치가 왜 던킨 도너츠와 서브웨이 같은 주식에 투자해서 수십 배 수익을 냈을까요? 본인이 먹어보니 맛있고, 사람들이 아침마다 줄을 서는 걸 직접 눈으로 확인했기 때문입니다. 주식 투자는 멀리 있지 않습니다. 당신의 주변을 둘러보세요. 모두가 쓰는 서비스, 모두가 열광하는 그 제품이 바로 정답입니다.</p>\\n\\n<h3>생활 속의 불편함이 곧 기회이자 돈입니다.</h3>\\n<p>어떤 앱을 쓰는데 너무 편해서 감동했거나, 어떤 제품이 품절 대란이라 구하고 싶어도 못 구하는 상황인가요? 그럼 당장 그 회사를 파보세요. 애널리스트들의 복잡한 리포트보다 당신의 소비 경험이 훨씬 더 정확할 때가 많습니다. 주가는 실적이 찍히기 전에 기대감으로 먼저 움직이는데, 그 징후는 매장에서, 거리에서, 사람들의 대화 속에서 먼저 나타납니다. 당신의 촉을 믿으세요.</p>\\n\\n<h3>발굴 노하우 (실전 팁):</h3>\\n<ul>\\n  <li><strong>대형 할인점이나 편의점에 가서 매대 배치를 보세요.</strong> 가장 노른자 자리에 어떤 회사의 제품이 깔려 있는지 체크하세요.</li>\\n  <li><strong>본인과 친구들이 입을 모아 칭찬하는 새로운 서비스가 있다면</strong> 상장사 여부부터 확인하고 투자 포인트로 삼으세요.</li>\\n  <li><strong>내가 소비자로서 만족했다면,</strong> 다른 사람들도 열광할 확률이 99%입니다. 대중의 심리는 생각보다 단순합니다.</li>\\n</ul>\\n\\n<h3>실전 사례: 생활 밀착형 투자의 힘</h3>\\n<p>예를 들어, 최근 특정 배달 앱의 사용 빈도가 급증하고 있다고 가정해봅시다. 주변 사람들이 모두 그 앱을 사용하고, 배달 시간도 빠르고, 할인 혜택도 좋다면? 이는 명백한 투자 신호입니다. 해당 기업의 재무제표를 확인하고, 매출 성장률과 시장 점유율을 분석해보세요. 만약 긍정적인 지표들이 나온다면, 이는 훌륭한 투자 기회가 될 수 있습니다.</p>\\n<p>또 다른 예로, 특정 커피 브랜드가 급속도로 매장을 확장하고 있고, 항상 사람들로 붐빈다면? 이 역시 투자 기회입니다. 단, 맹목적으로 투자하지 말고, 해당 기업의 부채 비율, 영업이익률, 경쟁사 대비 우위 등을 꼼꼼히 따져봐야 합니다.</p>\\n\\n<h3>주의할 점: 유행과 트렌드를 구분하세요</h3>\\n<p>생활 밀착형 투자에서 가장 중요한 것은 <strong>일시적인 유행과 지속 가능한 트렌드를 구분</strong>하는 것입니다. 한두 달 반짝하고 사라지는 제품이나 서비스에 투자하면 큰 손실을 볼 수 있습니다. 최소 6개월 이상 꾸준히 사랑받는 제품인지, 경쟁력이 있는지를 확인해야 합니다.</p>\\n<p>또한, 생활 밀착형 투자라고 해서 재무제표 분석을 소홀히 해서는 안 됩니다. 아무리 좋은 제품이라도 기업이 적자를 지속하거나 부채가 과다하면 투자 가치가 떨어집니다. <strong>소비자 경험과 재무 분석을 모두 결합</strong>해야 성공적인 투자가 가능합니다.</p>\\n\\n<h3>결론 및 면책조항</h3>\\n<p>이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다. 어려운 용어에 현혹되지 마세요. 가장 좋은 주식은 초등학생에게도 이 회사가 무엇으로 돈을 버는지 설명할 수 있는 주식입니다. 당신이 가장 잘 아는 영역에서부터 투자를 시작해보세요. 그게 리스크를 줄이는 최고의 방법입니다. 건승을 빕니다!</p>\\n<div class=\\\"internal-links\\\" style=\\\"margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid var(--accent-color);\\\"><h4 style=\\\"margin-top: 0; margin-bottom: 1rem;\\\">💡 함께 읽어보면 좋은 글</h4><ul style=\\\"list-style: none; padding: 0; margin: 0;\\\"><li style=\\\"margin-bottom: 0.5rem;\\\"><a href=\\\"blog.html?id=11\\\" style=\\\"color: var(--accent-color); text-decoration: none; font-weight: 600;\\\">🔗 [멘탈 케어] 시드 머니 1,000만 원 만들기 전까지는 주식 앱 지우세요.</a></li><li style=\\\"margin-bottom: 0.5rem;\\\"><a href=\\\"blog.html?id=9\\\" style=\\\"color: var(--accent-color); text-decoration: none; font-weight: 600;\\\">🔗 [리스크 관리] 분산 투자는 비겁한 도망이 아니라 지혜로운 생존 전술입니다.</a></li></ul></div>"
};

// 4. Replace Jan 25 post (ID 33) - Keep but modify to be different
const jan25NewPost = {
    "id": 33,
    "title": "[배당 투자] 제2의 월급? 배당락에 뒤통수 맞고 울지 마세요.",
    "date": "2026.01.25",
    "publishDate": "2026-01-25",
    "content": "<h3>공짜 돈은 없습니다. 배당금 받으면 주가는 그만큼 빠집니다.</h3>\\n<p>배당락일 아침, 보유 종목 주가가 뚝 떨어져 있는 걸 보고 당황해서 고객센터 전화하는 주린이들 진짜 많습니다. 배당금은 회사가 가진 현금을 주주들에게 밖으로 내보내는 건데, 회사 가치가 그만큼 물리적으로 줄어드는 건 당연한 이치입니다. 문제는 배당금 수익률보다 주가가 훨씬 더 많이 빠지는 경우입니다. 배당 5% 받자고 들어갔다가 주가가 15% 빠지면 그건 손실입니다. 이걸 모르고 덤비면 평생 수업료만 내다 끝납니다.</p>\\n\\n<h3>배당수익률 7%, 근데 주가가 우하향한다면?</h3>\\n<p>그게 바로 배당 투자의 무서운 함정입니다. 단순히 수익률 숫자만 보고 들어갔다가 원금이 녹아내리는 거죠. 배당주를 고를 때 배당금이 이익에서 몇 퍼센트를 차지하는지(배당성향)를 먼저 봐야 합니다. 이익의 90%를 배당으로 준다? 그건 회사가 더 이상 성장할 의지가 없거나, 대주주가 현금을 급하게 빼가야 할 상황이라는 조심스러운 시그널일 수 있습니다.</p>\\n\\n<h3>배당 투자 원칙:</h3>\\n<ul>\\n  <li><strong>매년 배당금을 꾸준히 늘려온 '배당 성장주'에 주목하세요.</strong> 현재 수익률은 조금 낮아도 미래에 당신의 계좌를 지켜줄 효자가 됩니다.</li>\\n  <li><strong>배당을 주기 위해 대출을 받는 미친 짓을 하는 기업은 절대 피하세요.</strong> 재무 구조가 순식간에 망가집니다.</li>\\n  <li><strong>배당락 이후 주가 회복력이 좋은지 과거 데이터를 확인하세요.</strong> 3개월 안에 주가를 회복하지 못하는 종목은 매력이 없습니다.</li>\\n</ul>\\n\\n<h3>배당 성장주 vs 고배당주: 어떤 것을 선택할까?</h3>\\n<p><strong>배당 성장주</strong>는 현재 배당 수익률은 낮지만, 매년 배당금을 꾸준히 증가시키는 기업입니다. 예를 들어, 올해 배당 수익률이 2%라도, 매년 10%씩 배당금을 늘린다면 10년 후에는 배당 수익률이 5%를 넘을 수 있습니다. 이런 기업은 대부분 재무 건전성이 우수하고, 꾸준한 이익 성장을 기록하는 우량 기업입니다.</p>\\n<p>반면, <strong>고배당주</strong>는 현재 배당 수익률이 5~7% 이상으로 높지만, 배당금 증가율은 낮거나 오히려 감소하는 경우가 많습니다. 이런 기업은 성장이 정체된 성숙 산업에 속해 있거나, 일시적으로 높은 배당을 주는 경우가 많습니다. 주가 하락 위험이 크므로 신중하게 접근해야 합니다.</p>\\n\\n<h3>배당 투자 시 반드시 확인해야 할 지표</h3>\\n<ul>\\n  <li><strong>배당성향 (Payout Ratio):</strong> 순이익 중 배당금으로 지급하는 비율입니다. 일반적으로 30~50%가 적정 수준입니다. 80% 이상이면 위험 신호입니다.</li>\\n  <li><strong>배당 증가율:</strong> 최근 5년간 배당금이 얼마나 증가했는지 확인하세요. 꾸준히 증가하는 기업이 좋습니다.</li>\\n  <li><strong>부채비율:</strong> 부채가 과다한 기업은 배당을 유지하기 어렵습니다. 부채비율 100% 이하가 안전합니다.</li>\\n  <li><strong>영업현금흐름:</strong> 배당금을 현금으로 지급할 수 있는 능력이 있는지 확인해야 합니다.</li>\\n</ul>\\n\\n<h3>결론 및 면책조항</h3>\\n<p>이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다. 배당 투자는 인내의 열매입니다. 단기적인 주가 변동에 일희일비하지 말고, 복리의 힘을 믿으세요. 배당금이 재투자되어 당신의 주식 수를 늘려줄 때 비로소 부의 고속도로에 올라타게 될 겁니다. 오늘 내용이 도움 되셨길 바랍니다!</p>\\n<div class=\\\"internal-links\\\" style=\\\"margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid var(--accent-color);\\\"><h4 style=\\\"margin-top: 0; margin-bottom: 1rem;\\\">💡 함께 읽어보면 좋은 글</h4><ul style=\\\"list-style: none; padding: 0; margin: 0;\\\"><li style=\\\"margin-bottom: 0.5rem;\\\"><a href=\\\"blog.html?id=13\\\" style=\\\"color: var(--accent-color); text-decoration: none; font-weight: 600;\\\">🔗 [수익 분석] ROE 15% 이상 유지되는 기업은 장사의 달인이 운영하는 겁니다.</a></li><li style=\\\"margin-bottom: 0.5rem;\\\"><a href=\\\"blog.html?id=9\\\" style=\\\"color: var(--accent-color); text-decoration: none; font-weight: 600;\\\">🔗 [리스크 관리] 분산 투자는 비겁한 도망이 아니라 지혜로운 생존 전술입니다.</a></li></ul></div>"
};

// Find and replace each post
const post31Match = content.match(/\{\s*"id":\s*31,[\s\S]*?\}\s*,\s*\{/);
const post32Match = content.match(/\{\s*"id":\s*32,[\s\S]*?\}\s*,\s*\{/);
const post33Match = content.match(/\{\s*"id":\s*33,[\s\S]*?\}\s*,\s*\{/);

if (post31Match) {
    const oldPost31 = post31Match[0].slice(0, -3); // Remove trailing ",\s*{"
    content = content.replace(oldPost31, JSON.stringify(jan23NewPost, null, 8).replace(/\n/g, '\n        '));
}

if (post32Match) {
    const oldPost32 = post32Match[0].slice(0, -3);
    content = content.replace(oldPost32, JSON.stringify(jan24NewPost, null, 8).replace(/\n/g, '\n        '));
}

if (post33Match) {
    const oldPost33 = post33Match[0].slice(0, -3);
    content = content.replace(oldPost33, JSON.stringify(jan25NewPost, null, 8).replace(/\n/g, '\n        '));
}

// Write back
fs.writeFileSync(DB_PATH, content, 'utf8');
console.log('✅ Successfully updated Jan 23-25 posts and market briefing!');
