const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const DB_PATH = path.join(__dirname, '../data/content_db.js');

const PROMPT = `# Role: 전문 금융 칼럼니스트 및 주식 분석가 (이음스탁 브랜드 페르소나)
# Task: 주식 초보자를 위한 심층 투자 인사이트 포스팅 작성 (공백 제외 1000자 이상의 상세 분량)

## 필수 포함 사항 (융합 분석 스타일):
1. **기본적 분석(Fundamental)**: 해당 주제의 산업적 배경, 기업의 실적 로직, 경제 지표(금리, 환율 등)의 연관성을 40% 비중으로 설명.
2. **기술적 분석(Technical/Chart)**: 캔들 패턴, 이동평균선(정배열/역배열), 거래량, 보조지표(RSI, MACD, 스토캐스틱 등)를 활용한 타점 분석을 40% 비중으로 설명.
3. **실전 적용**: 위 두 분석을 결합하여 초보자가 지금 당장 차트와 재무제표에서 확인해야 할 핵심 포인트 제시.

## 콘텐츠 구성 가이드라인:
1. [도입부]: 해당 주제가 현재 시장에서 왜 뜨거운 화두인지 시의성을 반영하여 서술 (이음스탁 시그니처 톤).
2. [본론 1 - 시장의 맥락]: 산업의 변화나 거세 흐름을 분석 (기본적 분석 중심).
3. [본론 2 - 차트의 시그널]: 구체적인 보조지표 수치나 패턴을 예시로 들어 설명 (기술적 분석 중심).
4. [본론 3 - 전략 리포트]: "이런 시그널이 나오면 매수/매도 고려"와 같은 시나리오성 가이드 (ul/li 활용).
5. [결론 및 면책조항]: "이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다" 문구 포함.

## 기술적 요구사항:
- 소제목은 <h3> 태그 사용.
- 핵심 키워드는 <strong> 태그.
- 문단은 <p> 태그.
- **공백 제외 1000자 이상**의 풍부한 데이터와 논리를 담을 것.
- 형식: {"title": "제목", "content": "내용(HTML 태그 포함)"}

## 말투: 전문성과 친절함이 공존하는 백화점 매니저 같은 세련된 말투 (~입니다).`;

async function listVisibleModels() {
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models?key=${API_KEY}`,
        method: 'GET'
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                try {
                    const result = JSON.parse(body);
                    if (result.error) return reject(result.error);
                    const models = (result.models || []).map(m => m.name.split('/').pop());
                    resolve(models);
                } catch (e) {
                    reject(new Error(`ListModels Parse Error: ${e.message}`));
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function callGemini(modelName, existingPosts) {
    const titles = existingPosts.map(p => p.title);
    const customizedPrompt = `${PROMPT}\n\n참고: 최근 게시글 제목들(중복 피할 것): ${titles.join(', ')}`;

    const data = JSON.stringify({
        contents: [{ parts: [{ text: customizedPrompt }] }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
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
                    if (!result.candidates || !result.candidates[0]) return reject(new Error("No candidates"));
                    resolve(result.candidates[0].content.parts[0].text);
                } catch (e) {
                    reject(new Error(`Request Error: ${body}`));
                }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function generateBlogPost() {
    if (!API_KEY) {
        console.error('Error: GEMINI_API_KEY is not set.');
        process.exit(1);
    }

    try {
        const dbContent = fs.readFileSync(DB_PATH, 'utf8');
        let existingPosts = [];
        try {
            existingPosts = Array.from(dbContent.matchAll(/"id":\s*(\d+),\s*"title":\s*"([^"]+)"/g)).map(m => ({ id: m[1], title: m[2] }));
        } catch (e) {
            console.warn("Could not parse existing posts for internal linking.");
        }

        const allModels = await listVisibleModels();
        const textModels = allModels.filter(m =>
            (m.includes('gemini') || m.includes('gemma')) &&
            !m.includes('embedding') && !m.includes('tts') && !m.includes('image')
        );

        const preferredOrder = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro'];
        const modelToUse = preferredOrder.find(p => textModels.includes(p)) || textModels[0];

        if (!modelToUse) throw new Error("No suitable models found.");

        // 1. Generate Blog Post
        const textResult = await callGemini(modelToUse, existingPosts.slice(0, 10));

        // 2. Generate Daily Market Brief (Enhanced)
        const marketBriefPrompt = `금융 수석 전략가 '이음스탁'으로서 초보자에게 전하는 오늘의 시장 브리핑을 작성해줘.
조건:
1. 오늘 시장의 핵심 요인(예: 미국 국채 금리, CPI 지표, 외인 매수세, 환율 등)을 포함하여 6~8문장으로 상세히 작성할 것.
2. 단순히 현상을 나열하는 게 아니라 '왜' 그런 일이 벌어졌고 초보자가 무엇을 주의해야 하는지 분석적으로 서술할 것.
3. 말투는 세련된 전문가 톤.
4. JSON 형식으로만 응답해: {"brief": "내용"}`;

        const marketBriefRaw = await new Promise((resolve, reject) => {
            const data = JSON.stringify({ contents: [{ parts: [{ text: marketBriefPrompt }] }] });
            const options = {
                hostname: 'generativelanguage.googleapis.com',
                path: `/v1beta/models/${modelToUse}:generateContent?key=${API_KEY}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            };
            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', d => body += d);
                res.on('end', () => {
                    try {
                        const result = JSON.parse(body);
                        resolve(result.candidates[0].content.parts[0].text);
                    } catch (e) { resolve('{"brief": "오늘도 차분한 마음으로 시장을 바라보며 원칙 투자를 이어가세요."}'); }
                });
            });
            req.on('error', () => resolve('{"brief": "오늘도 차분한 마음으로 시장을 바라보며 원칙 투자를 이어가세요."}'));
            req.write(data);
            req.end();
        });

        const today = new Date();
        const publishDate = today.toISOString().split('T')[0];
        const ids = existingPosts.map(p => parseInt(p.id));
        const nextId = Math.max(...ids, 0) + 1;

        const jsonMatch = textResult.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in AI response");
        const postData = JSON.parse(jsonMatch[0]);

        const marketBriefJsonMatch = marketBriefRaw.match(/\{[\s\S]*\}/);
        const marketBriefText = marketBriefJsonMatch ? JSON.parse(marketBriefJsonMatch[0]).brief : "오늘도 성투하세요!";

        // Internal Link Logic
        let contentWithLinks = postData.content;
        if (existingPosts.length > 0) {
            const randomPosts = existingPosts.sort(() => 0.5 - Math.random()).slice(0, 2);
            let internalLinksHtml = `<div class="internal-links" style="margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid var(--accent-color);">`;
            internalLinksHtml += `<h4 style="margin-top: 0; margin-bottom: 1rem;">💡 함께 읽어보면 좋은 글</h4><ul style="list-style: none; padding: 0; margin: 0;">`;
            randomPosts.forEach(p => {
                internalLinksHtml += `<li style="margin-bottom: 0.5rem;"><a href="blog.html?id=${p.id}" style="color: var(--accent-color); text-decoration: none; font-weight: 600;">🔗 ${p.title}</a></li>`;
            });
            internalLinksHtml += `</ul></div>`;
            contentWithLinks += "\n" + internalLinksHtml;
        }

        const newPost = {
            id: nextId,
            title: postData.title,
            date: publishDate.replace(/-/g, '.'),
            publishDate: publishDate,
            content: contentWithLinks
        };

        // Update DB
        let updatedDb = dbContent.replace(/"blog_posts":\s*\[/, `"blog_posts": [\n        ${JSON.stringify(newPost, null, 8).replace(/\n/g, '\n        ').trim()},`);

        if (updatedDb.includes('"market_brief":')) {
            updatedDb = updatedDb.replace(/"market_brief":\s*"[^"]*"/, `"market_brief": "${marketBriefText.replace(/"/g, '\\"')}"`);
        } else {
            updatedDb = updatedDb.replace('const CONTENT_DB = {', `const CONTENT_DB = {\n    "market_brief": "${marketBriefText.replace(/"/g, '\\"')}",`);
        }

        fs.writeFileSync(DB_PATH, updatedDb, 'utf8');
        console.log(`Success! Created Post #${nextId} and updated Market Brief.`);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

generateBlogPost();
