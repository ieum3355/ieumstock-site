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
    형식은 HTML 태그(<p>, <h4>, <div class='highlight-box'> 등)를 포함한 문자열이어야 해.
    내용은 매우 전문적이면서도 초보자가 이해하기 쉬워야 하며, 심리학이나 실전 매매 기술 위주면 좋겠어.
    제목과 내용을 포함한 JSON 데이터로 응답해줘. 
    JSON 예시: {"title": "제목", "content": "내용"} 
    반드시 한국어로 작성할 것.`;

    const data = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => responseBody += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseBody);
                    // Extract text from Gemini response structure
                    const text = result.candidates[0].content.parts[0].text;
                    // Clean code blocks if present
                    const cleanJson = text.replace(/```json|```/g, '').trim();
                    const postData = JSON.parse(cleanJson);

                    const newPost = {
                        id: nextId,
                        title: postData.title,
                        date: publishDate.replace(/-/g, '.'),
                        publishDate: publishDate,
                        content: postData.content
                    };

                    // Insert into DB (very basic string insertion)
                    const updatedDb = dbContent.replace(
                        /"blog_posts":\s*\[/,
                        `"blog_posts": [\n        ${JSON.stringify(newPost, null, 8)},`
                    );

                    fs.writeFileSync(DB_PATH, updatedDb, 'utf8');
                    console.log(`Successfully generated Post #${nextId}: ${postData.title}`);
                    resolve();
                } catch (e) {
                    console.error('Failed to parse Gemini response:', responseBody);
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
