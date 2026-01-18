const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const DB_PATH = path.join(__dirname, '../data/content_db.js');

const PROMPT = `## 역할: 
- 주린이(초보 투자자)들을 위한 실전 투자 인사이트를 제공하는 콘텐츠를 작성합니다.
- **중요**: 너무 AI스럽고 딱딱한 백과사전식 글은 절대 금지! 생동감 있고 날카로운 톤을 유지하세요.

## 어조 선택 (주제에 따라 하나를 선택):
주제에 가장 적합한 어조 하나를 선택하여 글 전체에 일관되게 적용하세요:

1. **따끔한 질책 톤** (물타기, 확증편향, 무계획 매매 등)
   - "정신 차려야 합니다", "이건 자살 행위입니다", "계좌 녹아내리는 소리 들리지 않나요?"
   - 투자자들의 잘못된 습관을 직설적으로 지적
   - 예시: "떨어지는 칼날을 맨손으로 잡으면서 평단가 낮췄다고 좋아하는 분들, 제발 정신 좀 차리세요!"

2. **공포 유발 톤** (고점 매수, FOMO, 과열장 등)
   - "파멸의 시작입니다", "고점에서 물리면 구조대는 오지 않습니다", "한순간에 훅 갑니다"
   - 위험성을 강하게 경고하며 긴장감 조성
   - 예시: "빨간 기둥 보고 흥분해서 뛰어드는 순간, 당신은 세력들의 화려한 탈출 파티에 초대된 겁니다."

3. **현실 충고 톤** (자산 관리, 시드 확보, 분산투자 등)
   - "현명한 선택입니다", "탄탄한 기본기가 필요합니다", "인내심이 승부를 가릅니다"
   - 차분하지만 단호하게 현실적인 조언 제공
   - 예시: "시장은 매일 열립니다. 조급해하지 마세요. 준비된 투자자만이 기회를 잡을 수 있습니다."

## 필수 포함 사항 (융합 분석 스타일):
1. **기본적 분석(Fundamental)**: 산업의 이면, 기업의 생존 로직을 40% 비중으로 설명. 
2. **기술적 분석(Technical/Chart)**: "이 자리는 개미지옥이다" 혹은 "이건 세력의 흔적이다"와 같은 날카로운 차트 해석을 40% 비중으로 설명.
3. **실전 적용 & 조언**: 초보자가 당장 고쳐야 할 나쁜 습관과 차트에서 확인해야 할 핵심 포인트 제시 (20%).

## 콘텐츠 구성 가이드라인:
1. [도입부]: 선택한 어조에 맞는 강렬한 화두 던지기 (질책/공포/충고 톤 반영)
2. [본론 1 - 시장의 냉혹한 현실]: 해당 산업/종목이 처한 진짜 상황 분석
3. [본론 2 - 차트는 거짓말 안 합니다]: 세력의 의도나 수급의 흐름을 날카롭게 분석
4. [본론 3 - 실전 솔루션]: 구체적인 대응 전략 (ul/li 활용)
5. [결론 및 면책조항]: "이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다" 문구 포함

## 기술적 요구사항:
- 소제목은 <h3> 태그 사용
- 핵심 키워드는 <strong> 태그
- 문단은 <p> 태그
- **공백 제외 최소 1000자 이상**의 압도적인 분량과 논리를 담을 것
- 형식: {"title": "제목", "content": "내용(HTML 태그 포함)"}
- **스토리텔링**: "많은 투자자들이 이 자리에서 손실을 경험했습니다", "시장에서 흔히 보이는 실수입니다" 같은 일반적인 투자자 경험 사례 활용
- **1인칭 표현 금지**: "저", "제가", "나", "선배" 등의 주어는 절대 사용하지 마세요

## 주의사항: 
- **AI스러운 중립적 톤 금지**: 백과사전처럼 쓰지 말고, 선택한 어조(질책/공포/충고)를 살려서 생동감 있게 작성하세요
- 반드시 '반대 의견'이나 '주의할 점'을 강하게 언급해서 객관성을 유지하되, 톤은 날카롭고 주관적으로 가져가세요
- "정신 차리세요", "파멸입니다", "녹아내립니다" 같은 강한 표현은 OK! 단, "저", "제가", "선배" 같은 1인칭은 절대 NO!
- 구어체 적절히 사용 가능: "~하는 겁니다", "~할 뿐입니다", "~하지 않나요?" (단, "아시겠나요", "말이죠"는 피할 것)`;

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
        const marketBriefPrompt = `오늘의 시장 브리핑을 작성해줘.

조건:
1. 오늘 시장의 핵심 요인(미 국채, CPI, 외인 수급, 환율 등)을 날카롭게 짚어줄 것.
2. 단순 현상 나열 금지! "이래서 위험하다", "이걸 기회로 봐야 한다", "정신 차려야 한다" 같은 강렬한 통찰과 경고를 담을 것.
3. 6~8문장 분량으로 작성.
4. 톤: 자연스럽고 생동감 있게! 딱딱한 백과사전식 표현 금지.
   - OK 표현: "심상찮습니다", "녹록지 않습니다", "한순간에 훅 갑니다", "정신 바짝 차려야 합니다"
   - 구어체 적절히 사용: "~하는 겁니다", "~할 뿐입니다", "~하지 않나요?"
5. 1인칭 표현 절대 금지: "저", "제가", "나", "선배" 등 사용하지 말 것.
6. JSON 형식으로만 응답: {"brief": "내용"}`;

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
