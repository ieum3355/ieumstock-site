const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const DB_PATH = path.join(__dirname, '../data/content_db.js');

const PROMPT_BASE = `# Role: 전문 금융 칼럼니스트 및 주식 분석가 (이음스탁 브랜드 페르소나)
# Task: 주식 초보자를 위한 실전 기술적/기본적 분석 포스팅 작성 (공백 제외 1000자 이상의 상세한 분량)

## 콘텐츠 구성 가이드라인:
1. [도입부] 2. [본론 1 - 이론] 3. [본론 2 - 실전 차트/데이터 분석] 4. [본론 3 - 체크리스트] 5. [결론 및 면책조항]

## 기술적 요구사항:
- HTML 구조화 (<h3>, <strong>, <p>)
- 공백 제외 1000자 이상 필수.
- 형식: {"title": "제목", "content": "내용(HTML 태그 포함)"}
- 반드시 JSON으로만 응답해.`;

const TOPICS = [
    "캔들 차트 패턴 분석: 망치형과 역망치형의 비밀",
    "이동평균선의 골든크로스와 데드크로스 실전 활용법",
    "RSI 지표를 활용한 과매수/과매도 구간 탈출 전략",
    "지지원과 저항선을 이용한 매수 타점 잡기",
    "거래량 분석: 진짜 상승과 가짜 상승을 구분하는 법",
    "볼린저 밴드 상하단 돌파 시나리오",
    "MACD 지표의 히스토그램 해석과 매매 타이밍",
    "주식 투자 심리학: 손실 회피 편향 극복하기",
    "재무제표 기초: PER, PBR, ROE를 실전 투자에 적용하기",
    "배당주 투자 전략: 배당 성향과 시가 배당률 분석",
    "테마주 매매 시 주의사항과 대장주 찾는 법",
    "미국 증시와 한국 증시의 커플링/디커플링 분석",
    "환율 변동에 따른 수출입 우량주 대응 전략",
    "분산 투자와 포트폴리오 리밸런싱의 실전 사례",
    "금리 인상기 대형 성장주 vs 가치주 투자법",
    "차트 분석의 기본: 추세선 그리는 법과 추세 전환 포착",
    "심리 지표 피어 앤 그리드(Fear & Greed) 지수 활용법",
    "공모주 청약 전 필수 체크리스트와 매도 전략",
    "외국인과 기관의 수급 분석: 따라가야 할까?",
    "스토캐스틱 지표의 다이버전스 분석"
];

async function callGemini(topic) {
    const customizedPrompt = `${PROMPT_BASE}\n\n오늘의 주제: ${topic}`;
    const data = JSON.stringify({ contents: [{ parts: [{ text: customizedPrompt }] }] });
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                try {
                    const result = JSON.parse(body);
                    if (result.error) return reject(result.error);
                    resolve(result.candidates[0].content.parts[0].text);
                } catch (e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function backfill() {
    if (!API_KEY) { console.error('API KEY missing'); return; }

    const dbContent = fs.readFileSync(DB_PATH, 'utf8');
    let updatedDb = dbContent;

    for (let i = 0; i < TOPICS.length; i++) {
        console.log(`Generating post ${i + 1}/${TOPICS.length}: ${TOPICS[i]}`);
        try {
            const raw = await callGemini(TOPICS[i]);
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (!jsonMatch) continue;
            const postData = JSON.parse(jsonMatch[0]);

            const date = new Date();
            date.setDate(date.getDate() - (i + 1)); // Past dates
            const dateStr = date.toISOString().split('T')[0];
            const displayDate = dateStr.replace(/-/g, '.');

            const nextId = 100 + i; // Unique IDs for backfill

            const newPost = {
                id: nextId,
                title: postData.title,
                date: displayDate,
                publishDate: dateStr,
                content: postData.content
            };

            const newPostStr = JSON.stringify(newPost, null, 8).replace(/\n/g, '\n        ').trim();
            updatedDb = updatedDb.replace(/"blog_posts":\s*\[/, `"blog_posts": [\n        ${newPostStr},`);

            // Avoid rate limits
            await new Promise(r => setTimeout(r, 2000));
        } catch (e) {
            console.error(`Error on post ${i}:`, e.message);
        }
    }

    fs.writeFileSync(DB_PATH, updatedDb, 'utf8');
    console.log('Backfill complete!');
}

backfill();
