const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const DB_PATH = path.join(__dirname, '../data/content_db.js');

const PROMPT = `# Role: 전문 금융 칼럼니스트 및 주식 분석가 (이음스탁 브랜드 페르소나)
# Task: 주식 초보자를 위한 심층 정보성 포스팅 작성 (공백 제외 1000자 이상의 상세한 분량)

## 콘텐츠 구성 가이드라인 (반드시 포함할 것):
1. [도입부]: 해당 주제가 현재 왜 중요한지 시의성을 반영하여 3문장 이상 서술.
2. [본론 1 - 핵심 로직]: 단순 정의가 아닌 원인과 결과(예: 금리 인하 -> 유동성 공급 -> 기술주 유리)를 논리적으로 설명.
3. [본론 2 - 초보자 맞춤 팁]: "주식 초보라면 이 점을 주의해야 합니다"와 같은 조언 세그먼트 포함.
4. [본론 3 - 체크리스트]: 독자가 바로 실행할 수 있는 체크리스트나 핵심 요약 3가지(ul/li 태그 활용).
5. [결론 및 면책조항]: "이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다" 문구 포함.

## 기술적 요구사항 (HTML 구조화):
- 제목(title) 외에 본문 내의 소제목은 <h3> 태그를 사용하여 구조화할 것. (<h2>는 시스템에서 자동 부여하므로 본문엔 <h3> 사용)
- 중요한 키워드는 <strong> 태그로 강조할 것.
- 문단은 <p> 태그로 명확히 구분하고, 가독성을 위해 문장 사이 적절한 공백 유지.
- 공백 제외 1000자 이상의 충분한 정보를 담은 고품질 콘텐츠로 작성할 것.
- 반드시 아래 JSON 형식으로만 응답해. 다른 설명은 하지 마.
- 형식: {"title": "제목", "content": "내용(HTML 태그 포함)"}

## 말투 및 톤앤매너:
- 친절하면서도 전문적인 '이음스탁'만의 톤 유지 (~입니다, ~하세요).
- AI가 쓴 것처럼 보이지 않도록 '필자의 사견'을 담은 표현(예: "개인적인 관점에서는 ~라고 보입니다")을 섞어서 작성.
- 언어는 한국어로 작성할 것.`;

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
        // Simple extraction of blog_posts array
        const blogPostsMatch = dbContent.match(/"blog_posts":\s*(\[[\s\S]*?\])/);
        let existingPosts = [];
        if (blogPostsMatch) {
            try {
                // We need to be careful with JSON.parse if the content is JS code
                // Since it's const CONTENT_DB = { ... }, it's not strictly JSON.
                // But for now, let's use a simpler regex or a cleaner way.
                existingPosts = Array.from(dbContent.matchAll(/"id":\s*(\d+),\s*"title":\s*"([^"]+)"/g)).map(m => ({ id: m[1], title: m[2] }));
            } catch (e) {
                console.warn("Could not parse existing posts for internal linking.");
            }
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

        // 2. Generate Daily Market Brief (New)
        const marketBriefPrompt = `금일 주식 시장의 일반적인 상황(예: 금리 추이, 거래 대금 변화 등)에 대해 
금융 전문가 '이음스탁'으로서 초보자에게 전하는 짧은 브리핑(3~4문장)을 작성해줘.
JSON 형식으로만 응답해: {"brief": "내용"}`;

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

        // Internal Link Logic: Add 1-2 random internal links
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

        // Update DB with both new post and market brief
        let updatedDb = dbContent.replace(/"blog_posts":\s*\[/, `"blog_posts": [\n        ${JSON.stringify(newPost, null, 8).replace(/\n/g, '\n        ').trim()},`);

        // Add or update market_brief in DB
        if (updatedDb.includes('"market_brief":')) {
            updatedDb = updatedDb.replace(/"market_brief":\s*"[^"]*"/, `"market_brief": "${marketBriefText}"`);
        } else {
            updatedDb = updatedDb.replace('const CONTENT_DB = {', `const CONTENT_DB = {\n    "market_brief": "${marketBriefText}",`);
        }

        fs.writeFileSync(DB_PATH, updatedDb, 'utf8');
        console.log(`Success! Created Post #${nextId} and updated Market Brief.`);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

generateBlogPost();
