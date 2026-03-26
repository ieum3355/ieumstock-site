const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/content_db.js');

// 1. Missing Data Definitions
const catchUpData = [
    {
        date: "2026.03.23",
        publishDate: "2026-03-23",
        title: "[산업 분석] AI와 로봇의 결합, 2026년 주도 섹터는 정해졌다",
        content: `<h3>AI가 뇌라면 로봇은 몸입니다. 둘의 만남은 거스를 수 없는 대세입니다.</h3><p>최근 시장에서 가장 뜨거운 화두는 단순히 대화하는 AI를 넘어, 현실 세계에서 직접 움직이는 '피지컬 AI'입니다. 테슬라의 옵티머스부터 국내 기업들의 휴머노이드 로봇까지, 기술의 발전 속도가 예상을 뛰어넘고 있습니다. 오늘 코스피 지수가 5,400선을 돌파하며 강세를 보인 것 역시 이러한 첨단 산업에 대한 기대감이 반영된 결과입니다. 단순 테마를 넘어 실적이 찍히기 시작하는 구간에 진입했습니다.</p><h3>왜 하필 지금일까요? 고령화와 인건비 상승이 해답입니다.</h3><p>전 세계적인 인구 구조 변화는 로봇 도입을 선택이 아닌 생존의 문제로 만들고 있습니다. 물류 센터, 제조 현장, 심지어 서비스업까지 로봇이 침투하고 있습니다. 특히 AI 알고리즘의 고도화로 과거에는 불가능했던 복잡한 동작들이 가능해지면서 적용 범위가 기하급수적으로 늘어나고 있습니다. 이는 관련 부품주(감속기, 센서, 제어기)들에게는 수십 년 만에 찾아온 거대한 기회의 창입니다.</p><h3>실전 투자 전략:</h3><ul><li>하드웨어보다는 소프트웨어(AI 알고리즘) 경쟁력을 가진 기업에 주목하세요.</li><li>로봇의 관절 역할을 하는 핵심 부품인 '감속기' 국산화 기업을 체크하세요.</li><li>단기 급등에 따른 조정 시 분할 매수하는 인내심이 필요합니다.</li></ul><p>이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다. 혁신은 늘 소리 없이 다가옵니다. 남들이 다 알 때 들어가면 늦습니다. 지금 바로 공부를 시작하세요!</p>`
    },
    {
        date: "2026.03.24",
        publishDate: "2026-03-24",
        title: "[기술적 분석] RSI 30에서의 반등? 다이버전스를 모르면 또 털립니다",
        content: `<h3>지표는 보조 수단일 뿐입니다. 하지만 그 속에 흐름이 보입니다.</h3><p>어제 급등했던 코스피가 오늘은 잠시 숨 고르기에 들어갔습니다. 이럴 때 많은 주린이가 RSI 지표만 보고 '과매도'라며 성급하게 매수 버튼을 누릅니다. 하지만 진짜 고수들은 지수가 내려가는데 지표 저점은 올라가는 '상승 다이버전스'가 나오기 전까지는 절대 움직이지 않습니다. 오늘의 조정은 오히려 건강한 흐름입니다. 추세가 깨진 건지, 일시적인 눌림목인지 구분하는 눈을 길러야 합니다.</p><h3>거래량 없는 하락을 두려워하지 마세요.</h3><p>오늘 하락 구간에서 거래량이 터지지 않았다는 것은 매도세가 강력하지 않다는 뜻입니다. 세력들이 물량을 던지는 게 아니라, 개인들의 차익 실현 물량을 받아내며 매집하는 과정일 확률이 높습니다. 이럴 때일수록 시야를 넓혀야 합니다. 장기 이평선이 우상향하고 있다면, 짧은 흔들림에 소중한 물량을 뺏기지 마세요.</p><h3>차트 체크포인트:</h3><ul><li>RSI 지표가 30 근처에서 쌍바닥을 형성하는지 확인하세요.</li><li>이평선과의 이격도가 너무 벌어지지 않았는지 체크가 우선입니다.</li><li>주요 지지선(전고점 부근)에서 꼬리가 달리는지 유심히 관찰하세요.</li></ul><p>이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다. 차트를 읽는 법은 시장이라는 거친 바다에서 살아남기 위한 유일한 지도입니다. 지도를 보는 법을 잊지 마세요.</p>`
    },
    {
        date: "2026.03.25",
        publishDate: "2026-03-25",
        title: "[거시 경제] 금리 동결의 역설, 시장은 벌써 다음 수를 보고 있습니다",
        content: `<h3>금리가 멈췄다고 좋아할 때가 아닙니다. 시장의 '질적 변화'를 보세요.</h3><p>오늘 코스피가 5,600선을 넘어서며 다시 한번 신고가 영역을 노크하고 있습니다. S&P 500 역시 견조한 흐름을 이어가고 있죠. 시장은 이제 '금리가 언제 내리느냐'보다 '현재의 고금리를 기업들이 얼마나 잘 버티느냐'에 집중하고 있습니다. 실적이 뒷받침되지 않는 좀비 기업들은 도태되고, 탄탄한 현금 흐름을 가진 우량주들로 수급이 쏠리는 '수급의 양극화' 현상이 뚜렷해지고 있습니다.</p><h3>환율의 변동성이 수출주들에게 기회가 되고 있습니다.</h3><p>원/달러 환율이 1,500원대에서 등락을 거듭하면서 자동차, 조선 등 주요 수출 산업들의 이익 체력이 강화되고 있습니다. 고환율이 물가에는 부담이지만, 국가 경쟁력 측면에서는 실질적인 이득으로 작용하는 구간입니다. 이러한 매크로 환경의 변화를 읽지 못하고 종목토론방만 기웃거려서는 절대 큰돈을 벌 수 없습니다.</p><h3>매크로 대응 지침:</h3><ul><li>현금 흐름표를 반드시 확인하고 부채 비율이 낮은 기업을 선별하세요.</li><li>환율 수혜를 직접적으로 받는 섹터(수출 비중 높은 종목)를 포트폴리오에 담으세요.</li><li>지수가 오를 때 낙관론에 취하지 말고 리스크 관리를 병행하세요.</li></ul><p>이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다. 거시 경제는 큰 파도와 같습니다. 파도를 타는 법을 배우면 멀리 갈 수 있습니다.</p>`
    },
    {
        date: "2026.03.26",
        publishDate: "2026-03-26",
        title: "[투자 마인드] 수익금보다 '원칙'을 먼저 생각하는 사람이 마지막에 웃습니다",
        content: `<h3>계좌의 파란색보다 마음의 파란색을 먼저 다스려야 합니다.</h3><p>오늘 시장은 예상보다 강한 조정을 받고 있습니다. 5,600선에서 차익 실현 매물이 쏟아지며 많은 투자자가 공포에 질려 '패닉 셀'을 고민하고 계실 겁니다. 하지만 기억하세요. 투자는 감정으로 하는 게 아니라 통계로 하는 겁니다. 당신의 매수 근거가 기업의 가치였다면, 주가가 떨어진 지금은 오히려 더 싸게 살 수 있는 기회입니다. 하지만 근거가 '남이 좋다고 해서'였다면, 지금의 하락은 감당하기 힘든 지옥일 것입니다.</p><h3>FOMO를 이겨내는 사람만이 자산을 지킵니다.</h3><p>남들이 수백 퍼센트 수익 인증을 할 때 소외되는 기분, 주식 투자자라면 누구나 느껴봤을 겁니다. 하지만 그 소외감이 두려워 달리는 말에 올라타는 순간, 당신은 세력들의 설거지 대상이 됩니다. 자신만의 원칙(매수가, 손절가, 비중)이 없는 매매는 투자가 아니라 도박입니다. 도박사는 운이 좋으면 한두 번 벌 수는 있어도, 결국 시장이라는 거대한 카지노에서 깡통을 차게 됩니다.</p><h3>성공 투자를 위한 마음가짐:</h3><ul><li>하루에 한 번은 반드시 매매 일지를 쓰며 감정을 기록하세요.</li><li>수익 인증 사진에 흔들리지 마세요. 그건 그들의 시간이고 당신의 시간은 따로 있습니다.</li><li>손절가는 기계적으로 지키세요. 그게 당신의 소중한 시드를 지켜주는 마지막 방패입니다.</li></ul><p>이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다. 시장은 당신의 인내심을 테스트하는 곳입니다. 그 테스트를 통과한 사람만이 부의 보상을 받을 자격이 있습니다.</p>`
    }
];

const latestMarketBrief = "[2026년 03월 26일 시장 요약] 오늘은 5,600선 돌파 이후 차익 실현 매물이 쏟아지며 하락세로 시작했습니다. 코스피는 5,560선에서 지지력을 테스트 중이며, 미국 증시 역시 금리 정책에 대한 경계감으로 혼조세를 보였습니다. 환율은 1,510원대로 소폭 상승하며 변동성을 키우고 있습니다. 급격한 추세 전환보다는 과열된 시장을 식히는 과정으로 보이니, 무리한 추격 매수보다는 보유 종목의 가치를 재점검하며 차분히 대응하는 자세가 필요한 시점입니다.";

// 2. Read and Parse DB
let raw = fs.readFileSync(DB_PATH, 'utf8');

// Use a more reliable way to extract the object literal
// Look for where CONTENT_DB = { starts and the final }; ends
const startMatch = raw.match(/var\s+CONTENT_DB\s*=\s*{/);
const startIdx = startMatch ? startMatch.index + startMatch[0].length - 1 : raw.indexOf('{');
// Find the closing brace of the main object - it's the one before the if (typeof module...)
const endIdx = raw.lastIndexOf('};');

if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find CONTENT_DB object limits');
    process.exit(1);
}

const valStr = raw.substring(startIdx, endIdx + 1);

let data;
try {
    // Wrap in parens to make it an expression
    data = eval('(' + valStr + ')');
} catch (e) {
    console.error('Failed to parse DB with eval:', e);
    process.exit(1);
}

// 3. Update Market Briefing
data.market_brief = latestMarketBrief;

// 4. Add Blog Posts (Prevent Duplicates by Date)
if (!data.blog_posts) data.blog_posts = [];

catchUpData.forEach(newPost => {
    const exists = data.blog_posts.find(p => p.date === newPost.date);
    if (!exists) {
        const nextId = Math.max(...data.blog_posts.map(p => p.id), 0) + 1;
        data.blog_posts.unshift({
            id: nextId,
            ...newPost
        });
        console.log(`✅ Added post for ${newPost.date}`);
    } else {
        console.log(`ℹ️ Post for ${newPost.date} already exists. Skipping.`);
    }
});

// 5. Write back to file accurately
const finalCode = `var CONTENT_DB = ${JSON.stringify(data, null, 8).replace(/\n/g, '\n')};\n\nif (typeof module !== 'undefined' && module.exports) {\n        module.exports = CONTENT_DB;\n}\n`;
fs.writeFileSync(DB_PATH, finalCode, 'utf8');

console.log('\n🎉 DB Repair and Catch-up successful!');
