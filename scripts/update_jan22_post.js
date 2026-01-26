const fs = require('fs');
const path = require('path');

// content_db.js 파일 읽기
const dbPath = path.join(__dirname, '../data/content_db.js');
let content = fs.readFileSync(dbPath, 'utf8');

// CONTENT_DB 객체 추출
const startIndex = content.indexOf('const CONTENT_DB = {');
const endIndex = content.lastIndexOf('};');
const dbString = content.substring(startIndex + 'const CONTENT_DB = '.length, endIndex + 1);

// JSON으로 파싱
const CONTENT_DB = eval('(' + dbString + ')');

// ID 25번 포스트 찾기
const post25Index = CONTENT_DB.blog_posts.findIndex(post => post.id === 25);

if (post25Index !== -1) {
    // 새로운 내용으로 교체
    CONTENT_DB.blog_posts[post25Index] = {
        "id": 25,
        "title": "[리스크 관리] 손절매는 패배가 아닙니다. 다음 기회를 위한 현명한 선택입니다.",
        "date": "2026.01.22",
        "publishDate": "2026-01-22",
        "content": "<h3>손실을 인정하지 못하는 투자자는 결국 더 큰 손실을 맞이합니다</h3>\n<p>많은 투자자들이 손절매를 '패배'로 생각합니다. 하지만 이는 잘못된 인식입니다. 손절매는 <strong>더 큰 손실을 막고 자본을 보존하기 위한 전략적 선택</strong>입니다. 시장에서 100% 승률을 기록하는 투자자는 없습니다. 중요한 것은 손실을 최소화하고 수익을 극대화하는 것입니다.</p>\n\n<h3>본론 1 - 시장의 냉혹한 현실: 물타기는 희망이 아니라 집착입니다</h3>\n<p>주가가 하락하면 많은 투자자들이 평단가를 낮추기 위해 추가 매수, 즉 '물타기'를 합니다. 하지만 <strong>근거 없는 물타기는 매우 위험</strong>합니다. 기업의 펀더멘털이 훼손되었거나, 산업 전망이 악화된 상황에서 물타기를 하는 것은 구멍 난 배에 계속 물을 퍼붓는 것과 같습니다.</p>\n<p>예를 들어, 특정 기업이 회계 부정이나 경영진 비리로 주가가 폭락했다고 가정해봅시다. 이런 상황에서 '싸게 샀다'며 물타기를 하는 것은 매우 위험한 행동입니다. 기업의 신뢰가 무너지면 주가 회복은 매우 어렵습니다. 오히려 상장폐지 위험까지 있을 수 있습니다.</p>\n<p>물타기를 고려하기 전에 반드시 확인해야 할 사항들이 있습니다:</p>\n<ul>\n  <li><strong>하락 원인 분석:</strong> 일시적인 시장 조정인지, 기업의 펀더멘털 악화인지 구분해야 합니다.</li>\n  <li><strong>산업 전망:</strong> 해당 산업이 성장 중인지, 쇠퇴 중인지 확인해야 합니다.</li>\n  <li><strong>재무 건전성:</strong> 부채비율, 현금흐름, 영업이익 추이를 점검해야 합니다.</li>\n</ul>\n\n<h3>본론 2 - 차트는 거짓말 안 합니다: 손절 타이밍을 놓치지 마세요</h3>\n<p>기술적 분석 관점에서 손절매 타이밍은 매우 중요합니다. 일반적으로 다음과 같은 상황에서는 손절을 고려해야 합니다:</p>\n<ul>\n  <li><strong>주요 지지선 붕괴:</strong> 장기 이동평균선(60일선, 120일선)을 하향 돌파하면 추세 전환 신호입니다.</li>\n  <li><strong>거래량 동반 하락:</strong> 대량 거래와 함께 주가가 하락하면 매도세가 강하다는 의미입니다.</li>\n  <li><strong>음봉 연속 출현:</strong> 장대 음봉이 연속으로 나타나면 하락 추세가 강화되고 있다는 신호입니다.</li>\n</ul>\n<p>많은 투자자들이 '조금만 더 기다리면 오르겠지'라는 희망 회로를 돌립니다. 하지만 차트가 명확한 하락 신호를 보내고 있다면, 감정을 배제하고 냉정하게 손절해야 합니다. <strong>손절은 빠를수록 좋습니다.</strong> -5%에서 손절할 것을 -10%, -20%까지 버티다가 결국 -30%, -50%의 손실을 보게 됩니다.</p>\n\n<h3>본론 3 - 실전 솔루션: 손절매 원칙 세우기</h3>\n<p>성공적인 투자를 위해서는 명확한 손절매 원칙이 필요합니다. 다음과 같은 방법을 추천합니다:</p>\n<ul>\n  <li><strong>비율 손절:</strong> 매수가 대비 -5% 또는 -10% 하락 시 무조건 손절합니다. 감정을 배제하고 기계적으로 실행해야 합니다.</li>\n  <li><strong>기술적 손절:</strong> 주요 지지선(이동평균선, 추세선) 이탈 시 손절합니다.</li>\n  <li><strong>시간 손절:</strong> 일정 기간(예: 3개월) 동안 수익이 나지 않으면 손절하고 다른 기회를 찾습니다.</li>\n  <li><strong>펀더멘털 손절:</strong> 기업의 실적 악화, 악재 발생 시 즉시 손절합니다.</li>\n</ul>\n<p>손절 후에는 반드시 <strong>매매 일지를 작성</strong>해야 합니다. 왜 손실이 발생했는지, 어떤 실수를 했는지 기록하고 분석해야 같은 실수를 반복하지 않습니다. 손절은 실패가 아니라 <strong>학습의 기회</strong>입니다.</p>\n<p>또한, 손절 후에는 즉시 다른 종목에 투자하지 마세요. 감정이 격해진 상태에서 내린 결정은 대부분 잘못된 결정입니다. 충분히 휴식을 취하고, 냉정함을 되찾은 후에 다음 투자를 계획하세요.</p>\n\n<h3>결론 및 면책조항: 손절은 생존 전략입니다</h3>\n<p>손절매는 패배가 아닙니다. 오히려 <strong>시장에서 살아남기 위한 필수 전략</strong>입니다. 손실을 인정하지 못하고 계속 버티다가 원금을 모두 잃는 투자자들을 많이 봤습니다. 작은 손실은 감수하되, 큰 손실은 절대 피해야 합니다. 이것이 장기적으로 성공하는 투자자의 비결입니다.</p>\n<p><strong>이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다.</strong> 손절매는 쉽지 않지만, 반드시 필요한 투자 기술입니다. 오늘부터 손절매 원칙을 세우고 철저히 지키시기 바랍니다.</p>\n<div class=\"internal-links\" style=\"margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid var(--accent-color);\"><h4 style=\"margin-top: 0; margin-bottom: 1rem;\">💡 함께 읽어보면 좋은 글</h4><ul style=\"list-style: none; padding: 0; margin: 0;\"><li style=\"margin-bottom: 0.5rem;\"><a href=\"blog.html?id=18\" style=\"color: var(--accent-color); text-decoration: none; font-weight: 600;\">🔗 [따끔한 질책] '물타기'면 다 되는 줄 아십니까? 그건 자살 행위입니다.</a></li><li style=\"margin-bottom: 0.5rem;\"><a href=\"blog.html?id=21\" style=\"color: var(--accent-color); text-decoration: none; font-weight: 600;\">🔗 [마인드셋] 매매 일지 안 쓰는 투자자는 같은 실수를 반복하며 돈을 잃습니다.</a></li></ul></div>"
    };

    console.log('✅ Updated post ID 25 with new content about 손절매 (stop-loss)');
}

// 파일 다시 작성
const newContent = `const CONTENT_DB = ${JSON.stringify(CONTENT_DB, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONTENT_DB;
}
`;

fs.writeFileSync(dbPath, newContent, 'utf8');
console.log('✅ Successfully updated content_db.js');
