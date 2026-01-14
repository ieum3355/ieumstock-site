const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const DB_PATH = path.join(__dirname, '../data/content_db.js');

async function generateBlogPost() {
    if (!API_KEY) {
        console.error('Error: GEMINI_API_KEY is not set.');
        process.exit(1);
    }

    const today = new Date();
    // Schedule 2 days after the latest post OR today
    const publishDate = today.toISOString().split('T')[0];

    // Read current DB to find next ID
    const dbContent = fs.readFileSync(DB_PATH, 'utf8');
    const postsMatch = dbContent.match(/"blog_posts":\s*\[([\s\S]*?)\]/);

    // Simplistic ID detection
    const ids = Array.from(dbContent.matchAll(/"id":\s*(\d+)/g)).map(m => parseInt(m[1]));
    const nextId = Math.max(...ids, 0) + 1;

    const prompt = `주식 투자 초보자를 위한 실전 투자 인사이트 블로그 글을 하나 작성해줘. 
    반드시 아래 JSON 형식으로만 응답해. 다른 설명은 하지 마.
    형식: {"title": "제목", "content": "내용(HTML 태그 포함)"}
    내용에는 <p>, <h4>, <div class='highlight-box'> 태그를 적절히 섞어서 아주 전문적으로 작성해줘.
    언어는 한국어로 작성할 것.`;

    const data = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
    });

    const modelName = 'gemini-1.5-flash';
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    console.log(`Calling Gemini API: ${options.hostname}/v1beta/models/${modelName}:generateContent (Key: ***${API_KEY.slice(-4)})`);

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => responseBody += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseBody);
                    if (result.error) {
                        throw new Error(`Gemini API Error: ${result.error.message}`);
                    }

                    const text = result.candidates[0].content.parts[0].text;
                    // Robust JSON extraction
                    const jsonMatch = text.match(/\{[\s\S]*\}/);
                    if (!jsonMatch) throw new Error("Could not find JSON in response");

                    const postData = JSON.parse(jsonMatch[0]);

                    const newPost = {
                        id: nextId,
                        title: postData.title,
                        date: publishDate.replace(/-/g, '.'),
                        publishDate: publishDate,
                        content: postData.content
                    };

                    // Robust DB update
                    const updatedDb = dbContent.replace(
                        /"blog_posts":\s*\[/,
                        `"blog_posts": [\n        ${JSON.stringify(newPost, null, 8).replace(/\n/g, '\n        ').trim()},`
                    );

                    fs.writeFileSync(DB_PATH, updatedDb, 'utf8');
                    console.log(`Success! Post #${nextId}: ${postData.title}`);
                    resolve();
                } catch (e) {
                    console.error('--- Response Error Detail ---');
                    console.error('Raw Body:', responseBody);
                    console.error('Error:', e.message);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

generateBlogPost().catch(err => {
    console.error(err);
    process.exit(1);
});
