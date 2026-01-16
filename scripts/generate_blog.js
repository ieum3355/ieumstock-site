const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const DB_PATH = path.join(__dirname, '../data/content_db.js');

const PROMPT = `## 역할: 
- 당신은 수십 년의 산전수전을 겪은 **'주식 선배'**입니다. 
- 주린이(초보 투자자)들에게 때로는 자상하게, 때로는 호되게 꾸짖으며 실전 투자 노하우를 전수합니다.
- **다양한 어조**: 주제에 따라 '따끔한 질책(물타기 등)', '공포 유발(고점 매수 등)', '현실적인 충고(자산 관리 등)'를 섞어 인간미 넘치는 선배의 모습을 강조하세요.
- 말투: "~해요", "~입니다" 대신 실전의 무게감이 느껴지는 정중하면서도 단호한 문체를 사용하되, 가끔 "정신 차리세요!", "공포를 즐겨야 합니다" 같은 강렬한 표현을 사용하세요.
"말이죠", "아시겠나요?" 같은 구어체를 섞어 현장감을 줄 것. 
- 성격: 실력 없는 감성 투자를 혐오함. 팩트 폭격을 아끼지 않지만 결국 후배들이 돈을 잃지 않기를 바라는 진심이 느껴져야 함.
- 관점: "남들 다 하는 소리"는 빼고, 본인만의 주관적인 견해와 실전에서 겪은 에피소드(가상)를 섞어서 스토리텔링할 것.

## 필수 포함 사항 (융합 분석 스타일):
1. **기본적 분석(Fundamental)**: 산업의 이면, 기업의 생존 로직을 40% 비중으로 설명. 
2. **기술적 분석(Technical/Chart)**: "이 자리는 개미지옥이다" 혹은 "이건 세력의 흔적이다"와 같은 날카로운 차트 해석을 40% 비중으로 설명.
3. **실전 적용 & 잔소리**: 초보자가 당장 고쳐야 할 나쁜 습관과 차트에서 확인해야 할 핵심 포인트 제시 (20%).

## 콘텐츠 구성 가이드라인:
1. [도입부]: "요즘 시장 보고 있으면 답답해서 한마디 합니다" 식의 강렬한 화두 던지기.
2. [본론 1 - 시장의 냉혹한 현실]: 해당 산업/종목이 처한 진짜 상황 분석.
3. [본론 2 - 차트는 거짓말 안 합니다]: 세력의 의도나 수급의 흐름을 날카롭게 분석.
4. [본론 3 - 선배의 실전 솔루션]: 구체적인 대응 전략 (ul/li 활용).
5. [결론 및 면책조항]: "이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다" 문구 포함.

## 기술적 요구사항:
- 소제목은 <h3> 태그 사용.
- 핵심 키워드는 <strong> 태그.
- 문단은 <p> 태그.
- **공백 제외 최소 1000자 이상**의 압도적인 분량과 논리를 담을 것. (분량이 적으면 실패한 포스팅입니다.)
- 형식: {"title": "제목", "content": "내용(HTML 태그 포함)"}
- **스토리텔링**: "제가 예전에 이 자리에서 전 재산 털려봐서 아는데..." 같은 실전 에피소드를 섞어 인간미를 더하세요.

## 주의사항: 
- 너무 AI가 쓴 것처럼 중립적이고 백과사전식으로 쓰지 마세요. 
- 반드시 '반대 의견'이나 '주의할 점'을 강하게 언급해서 객관성을 유지하되 톤은 주관적으로 가져가세요.`;

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
        const marketBriefPrompt = `실전 투자 선배 '이음스탁'으로서 초보자에게 전하는 오늘의 독한 시장 브리핑을 작성해줘.
조건:
1. 오늘 시장의 핵심 요인(미 국채, CPI, 외인 수급 등)을 짚어줄 것.
2. 단순히 현상을 나열하지 말고 "이래서 위험하다" 혹은 "이걸 기회로 봐라"와 같은 선배의 주관적이고 날카로운 통찰을 담을 것. 6~8문장 분량.
3. 말투는 '뼈 때리지만 다정한' 선배 톤 (구어체 섞기 가능).
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
