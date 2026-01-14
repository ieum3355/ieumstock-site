const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const DB_PATH = path.join(__dirname, '../data/content_db.js');

const PROMPT = `주식 투자 초보자를 위한 실전 투자 인사이트 블로그 글을 하나 작성해줘. 
반드시 아래 JSON 형식으로만 응답해. 다른 설명은 하지 마.
형식: {"title": "제목", "content": "내용(HTML 태그 포함)"}
내용에는 <p>, <h4>, <div class='highlight-box'> 태그를 적절히 섞어서 아주 전문적으로 작성해줘.
언어는 한국어로 작성할 것.`;

async function listVisibleModels() {
    console.log(`[Debug] Attempting to list models with Key: ***${API_KEY ? API_KEY.slice(-4) : 'NONE'}`);
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
                    reject(new Error(`ListModels Parse Error: ${e.message} | Body: ${body}`));
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function callGemini(modelName) {
    const data = JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }] }]
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
        const availableModels = await listVisibleModels();
        console.log(`[Debug] Models visible to this key: ${availableModels.join(', ')}`);

        // Use the first available model that supports generation, preferred order
        const preferred = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
        const modelToUse = preferred.find(p => availableModels.includes(p)) || availableModels[0];

        if (!modelToUse) {
            throw new Error("No available models found for this API key.");
        }

        console.log(`[Action] Using model: ${modelToUse}`);
        const textResult = await callGemini(modelToUse);

        const today = new Date();
        const publishDate = today.toISOString().split('T')[0];
        const dbContent = fs.readFileSync(DB_PATH, 'utf8');
        const ids = Array.from(dbContent.matchAll(/"id":\s*(\d+)/g)).map(m => parseInt(m[1]));
        const nextId = Math.max(...ids, 0) + 1;

        const jsonMatch = textResult.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON in response");
        const postData = JSON.parse(jsonMatch[0]);

        const newPost = {
            id: nextId,
            title: postData.title,
            date: publishDate.replace(/-/g, '.'),
            publishDate: publishDate,
            content: postData.content
        };

        const updatedDb = dbContent.replace(/"blog_posts":\s*\[/, `"blog_posts": [\n        ${JSON.stringify(newPost, null, 8).replace(/\n/g, '\n        ').trim()},`);
        fs.writeFileSync(DB_PATH, updatedDb, 'utf8');
        console.log(`Success! Generated Post #${nextId}: ${postData.title}`);
    } catch (e) {
        console.error('--- Debugging Info ---');
        console.error(e);
        process.exit(1);
    }
}

generateBlogPost();
