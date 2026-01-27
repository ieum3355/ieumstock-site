const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const DB_PATH = path.join(__dirname, '../data/content_db.js');

const PROMPT = `## 역할: 
- 주린이(초보 투자자)들을 위한 실전 투자 인사이트를 제공하는 콘텐츠를 작성합니다.
- **중요**: 너무 AI스럽고 딱딱한 백과사전식 글은 절대 금지! 생동감 있고 날카로운 톤을 유지하세요.

## 주제 선정 가이드 (매일 다양하게):
다음 [주제 카테고리] 중 하나를 선택하여 작성하되, **최근 3일간 다룬 주제와 겹치지 않도록 하세요.**
1. **산업/섹터 분석**: 반도체, 2차전지, 바이오, 자동차, 방산, 조선 등 특정 산업의 현황과 리스크.
2. **거시 경제(Macro)**: 금리, 환율, 유가, 인플레이션이 내 계좌에 미치는 영향.
3. **기술적 분석(Chart)**: 캔들 패턴, 이평선, 거래량, 보조지표(RSI, MACD, 볼린저밴드) 심층 해설.
4. **투자 마인드셋**: 공포/탐욕 관리, 손절매 원칙, 계좌 관리, 멘탈 케어.
5. **재무제표/용어**: PER, PBR, ROE, 영업이익률 등 필수 용어의 실전 해석법.

## 어조 선택 (주제에 따라 하나를 선택):
1. **따끔한 질책 톤** (물타기, 확증편향, 무계획 매매 등)
   - "정신 차려야 합니다", "이건 자살 행위입니다", "계좌 녹아내립니다"

2. **공포 유발 톤** (고점 매수, FOMO, 과열장 등)
   - "파멸의 시작입니다", "구조대는 오지 않습니다", "폭탄 돌리기입니다"

3. **현실 충고 톤** (자산 관리, 시드 확보, 산업 분석)
   - "냉정해져야 합니다", "숫자는 거짓말하지 않습니다", "기본으로 돌아가세요"

## 필수 포함 사항 (융합 분석 스타일):
1. **선택한 주제의 심층 분석**: 겉핥기 식이 아닌, 구체적인 예시와 숫자를 들어 설명 (40%).
2. **시장/차트와의 연계**: 해당 주제가 현재 시장 상황이나 차트에서 어떻게 나타나는지 설명 (40%).
3. **실전 적용 & 조언**: 초보자가 당장 실천할 수 있는 구체적인 행동 지침 (20%).

## 콘텐츠 구성 가이드라인:
1. [도입부]: 선택한 어조에 맞는 강렬한 화두 던지기
2. [본론 1]: 주제에 대한 깊이 있는 분석 (산업/경제/차트 등)
3. [본론 2]: 구체적인 사례나 데이터, 차트 패턴 설명
4. [본론 3 - 실전 솔루션]: 대응 전략 (ul/li 활용)
5. [결론 및 면책조항]: "이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다" 문구 포함

## 기술적 요구사항:
- 소제목은 <h3> 태그 사용
- 핵심 키워드는 <strong> 태그
- 문단은 <p> 태그
- **공백 제외 최소 1000자 이상**의 압도적인 분량
- **1인칭 표현 금지**: "저", "제가", "나" 절대 사용 금지
- **중복 금지**: 최근 게시글 제목들과 비슷한 내용을 절대 피하고, 새로운 관점을 제시하세요.
- **JSON 형식 필수**: 반드시 JSON 포맷(title, content)으로 응답하세요.
- **줄바꿈 처리**: content 내부의 줄바꿈은 반드시 역슬래시 n (\\n)으로 이스케이프해야 합니다.`;

async function listVisibleModels() {
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models?key=${API_KEY}`,
        method: 'GET'
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            const chunks = [];
            res.on('data', d => chunks.push(d));
            res.on('end', () => {
                const body = Buffer.concat(chunks).toString('utf8');
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

async function callGemini(modelName, existingPosts, marketDataContext = '', retryCount = 0) {
    const titles = existingPosts.map(p => p.title);
    const customizedPrompt = `${PROMPT}${marketDataContext}\n\n참고: 최근 게시글 제목들(중복 피할 것): ${titles.join(', ')}`;

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
            const chunks = [];
            res.on('data', d => chunks.push(d));
            res.on('end', async () => {
                const body = Buffer.concat(chunks).toString('utf8');
                try {
                    const result = JSON.parse(body);
                    if (result.error) {
                        if (result.error.code === 429 && retryCount < 5) { // Increased retries to 5
                            const waitTime = (retryCount + 1) * 5000; // Increased base wait to 5 seconds
                            console.log(`⚠️ Rate limit hit (429). Retrying in ${waitTime / 1000} seconds...`);
                            await new Promise(r => setTimeout(r, waitTime));
                            return resolve(callGemini(modelName, existingPosts, marketDataContext, retryCount + 1));
                        }
                        return reject(result.error);
                    }
                    if (!result.candidates || !result.candidates[0]) return reject(new Error("No candidates"));
                    resolve(result.candidates[0].content.parts[0].text);
                } catch (e) {
                    console.error("JSON Parse Error. Body received:", body); // Debugging
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
        // Collect real-time market data first
        let marketDataContext = '';
        const marketDataPath = path.join(__dirname, '../data/market_data.json');

        if (fs.existsSync(marketDataPath)) {
            try {
                const marketData = JSON.parse(fs.readFileSync(marketDataPath, 'utf8'));
                let statusHeader = `\n\n[오늘의 실제 시장 데이터 - ${marketData.date}]\n`;
                if (marketData.isMarketClosed) {
                    statusHeader += `⚠️ 오늘은 ${marketData.marketClosedReason}으로 국내 증시가 열리지 않았습니다.\n`;
                }

                marketDataContext = statusHeader +
                    `- 코스피: ${marketData.korea.kospi.toFixed(2)} (${marketData.korea.kospiChangePercent > 0 ? '+' : ''}${marketData.korea.kospiChangePercent.toFixed(2)}% ${marketData.isMarketClosed ? '(휴장)' : ''})\n` +
                    `- S&P 500: ${marketData.us.sp500.price.toFixed(2)} (${marketData.us.sp500.changePercent}%)\n` +
                    `- 원/달러 환율: ${marketData.forex.usdKrw.toFixed(2)}원 (${marketData.forex.usdKrwChangePercent}%)\n` +
                    `- 시장 요약: ${marketData.summary}\n\n` +
                    `위 실제 데이터를 반드시 참고하여 정확한 내용으로 작성하세요. ` +
                    (marketData.isMarketClosed ? `특히 오늘은 휴장일이므로, 시장의 정중동(靜中動) 상황을 짚어주고 투자 원칙을 되새기는 방향으로 작성하세요.` : `추측이나 가상의 수치를 사용하지 마세요.`) + `\n`;
                console.log('✅ Market data loaded successfully');
            } catch (e) {
                console.warn('⚠️  Failed to parse market data, proceeding without it');
            }
        } else {
            console.warn('⚠️  Market data file not found, generating without real-time data');
        }

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
        const textResult = await callGemini(modelToUse, existingPosts.slice(0, 10), marketDataContext);

        // 2. Generate Daily Market Brief (Objective Facts Only)
        const marketBriefPrompt = `오늘의 시장 브리핑을 작성해줘. 다음 데이터를 바탕으로 작성할 것:
${marketDataContext}

조건:
1. **날짜 명시**: 반드시 "[YYYY년 MM월 DD일 시장 요약]"으로 시작할 것. (오늘 날짜: ${new Date().toLocaleDateString('ko-KR')})
2. **객관적 사실만 기재**: 위 데이터에 있는 수치(코스피, S&P500, 환율 등)를 정확히 인용할 것.
3. **주관적 의견/예측/경고 절대 금지**: "위험하다", "기회다", "심상찮다" 등 사용 금지.
4. **허용되는 표현**: "상승했습니다", "하락했습니다", "기록했습니다" 등.
5. 4~6문장 분량으로 간결하게 작성.
6. 1인칭 표현 절대 금지.
7. JSON 형식으로만 응답: {"brief": "[날짜] 내용..."}`;

        const marketBriefRaw = await new Promise((resolve, reject) => {
            const data = JSON.stringify({ contents: [{ parts: [{ text: marketBriefPrompt }] }] });
            const options = {
                hostname: 'generativelanguage.googleapis.com',
                path: `/v1beta/models/${modelToUse}:generateContent?key=${API_KEY}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            };
            const req = https.request(options, (res) => {
                const chunks = [];
                res.on('data', d => chunks.push(d));
                res.on('end', () => {
                    const body = Buffer.concat(chunks).toString('utf8');
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

        let jsonMatch = textResult.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("❌ No JSON found. Raw AI Response:\n", textResult);
            // Attempt to clean markdown
            const cleanText = textResult.replace(/```json/g, '').replace(/```/g, '');
            jsonMatch = cleanText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No JSON found in AI response");
        }

        // Sanitize: Replace actual newlines with escaped newlines to fix "multiline string" invalid JSON
        let postData;
        try {
            const sanitizedJson = jsonMatch[0].replace(/\n/g, "\\n").replace(/\r/g, "");
            postData = JSON.parse(sanitizedJson);
        } catch (e) {
            console.warn("⚠️ JSON Parse failed. Using Regex fallback...");
            const titleMatch = textResult.match(/"title"\s*:\s*"([^"]*?)"/);
            // Match content: "content": "..." -> Look for the last quote before the closing brace
            const contentMatch = textResult.match(/"content"\s*:\s*"([\s\S]*?)"\s*\}/);

            if (titleMatch && contentMatch) {
                // Manually handle escaped newlines if likely present in raw text
                let rawContent = contentMatch[1];
                // Should we unescape? If textResult had actual newlines, we keep them (HTML is fine with newlines).
                // But we might need to unescape \" to "
                postData = {
                    title: titleMatch[1],
                    content: rawContent.replace(/\\"/g, '"').replace(/\\n/g, '\n')
                };
            } else {
                console.error("Fallback failed. Raw text:", textResult);
                throw e; // Throw original error
            }
        }

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
