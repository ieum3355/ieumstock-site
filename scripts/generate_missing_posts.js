require('dotenv').config();
const fs = require('fs');
const path = require('path');

/**
 * 빠진 날짜의 블로그 포스트 생성 스크립트
 * 6개의 새로운 다양한 주제로 콘텐츠 생성
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CONTENT_DB_PATH = path.join(__dirname, '../data/content_db.js');

// 생성할 포스트 정보
const postsToGenerate = [
    {
        id: 36,
        date: '2026.01.22',
        publishDate: '2026-01-22',
        category: '[투자 전략]',
        topic: '섹터 순환 투자',
        title: '섹터 순환 투자: 업종별 사이클을 읽고 타이밍을 잡는 법',
        keywords: '섹터 순환, 업종 로테이션, 경기 사이클, IT섹터, 금융섹터, 방어주'
    },
    {
        id: 37,
        date: '2026.01.23',
        publishDate: '2026-01-23',
        category: '[기술적 분석]',
        topic: '이동평균선 실전 활용',
        title: '이동평균선 실전 활용: 골든크로스만 믿다간 물립니다',
        keywords: '이동평균선, 골든크로스, 데드크로스, 정배열, 역배열, 지지선'
    },
    {
        id: 38,
        date: '2026.01.24',
        publishDate: '2026-01-24',
        category: '[투자 철학]',
        topic: '가치주 vs 성장주',
        title: '가치주 vs 성장주: 당신에게 맞는 투자 스타일을 찾아라',
        keywords: '가치주, 성장주, 투자 스타일, PER, PBR, 배당주, 테크주'
    },
    {
        id: 39,
        date: '2026.01.25',
        publishDate: '2026-01-25',
        category: '[시장 분석]',
        topic: '공포·탐욕 지수',
        title: '공포·탐욕 지수로 시장 심리 읽기: 역발상 투자의 핵심',
        keywords: '공포탐욕지수, 시장심리, 역발상투자, VIX지수, 투자심리'
    },
    {
        id: 40,
        date: '2026.01.26',
        publishDate: '2026-01-26',
        category: '[리스크 관리]',
        topic: '포트폴리오 리밸런싱',
        title: '포트폴리오 리밸런싱: 언제, 어떻게 비중을 조절할 것인가',
        keywords: '리밸런싱, 포트폴리오, 자산배분, 비중조절, 수익실현'
    }
];

// Gemini API 호출 함수
async function generateBlogContent(postInfo) {
    const https = require('https');

    const prompt = `당신은 주식 투자 전문가입니다. 다음 주제로 블로그 포스트를 작성해주세요.

**주제**: ${postInfo.topic}
**카테고리**: ${postInfo.category}
**키워드**: ${postInfo.keywords}

**작성 지침**:
1. **톤앤매너**: 
   - 객관적이고 전문적인 어조
   - "주식 선배", "나", "저" 등 1인칭 표현 절대 금지
   - 존댓말 사용 ("~합니다", "~세요")
   - 따끔하고 직설적이지만 교육적인 톤

2. **구조** (반드시 이 구조를 따르세요):
   - <h3>도입부: 핵심 메시지</h3>
   - <h3>본론 1 - 시장의 냉혹한 현실: [소제목]</h3>
   - <h3>본론 2 - 차트는 거짓말 안 합니다: [소제목]</h3>
   - <h3>본론 3 - 실전 솔루션: [소제목]</h3>
   - <h3>결론 및 면책조항</h3>

3. **내용 요구사항**:
   - 총 길이: 1500자 이상 (공백 제외)
   - 구체적인 예시와 수치 포함
   - 실전 팁을 <ul><li> 형태로 3-5개 제공
   - 기술적 분석 관점 포함 (차트, 지표 등)
   - 펀더멘털 분석 관점 포함 (재무, 산업 등)

4. **필수 포함 요소**:
   - 면책조항: "이 정보는 투자 참고용이며, 최종 결정은 본인에게 있습니다."
   - 내부 링크 섹션 (아래 형식 그대로 사용):

<div class="internal-links" style="margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 12px; border-left: 4px solid var(--accent-color);"><h4 style="margin-top: 0; margin-bottom: 1rem;">💡 함께 읽어보면 좋은 글</h4><ul style="list-style: none; padding: 0; margin: 0;"><li style="margin-bottom: 0.5rem;"><a href="blog.html?id=9" style="color: var(--accent-color); text-decoration: none; font-weight: 600;">🔗 [리스크 관리] 분산 투자는 비겁한 도망이 아니라 지혜로운 생존 전술입니다.</a></li><li style="margin-bottom: 0.5rem;"><a href="blog.html?id=21" style="color: var(--accent-color); text-decoration: none; font-weight: 600;">🔗 [마인드셋] 매매 일지 안 쓰는 투자자는 같은 실수를 반복하며 돈을 잃습니다.</a></li></ul></div>

5. **금지 사항**:
   - 1인칭 표현 ("나", "저", "제가", "주식 선배" 등)
   - 과도하게 주관적인 표현 ("심상찮다", "정신 차려야" 등)
   - 특정 종목 추천
   - 수익 보장 표현

**HTML 형식으로 작성하되, 이스케이프 처리 없이 순수 HTML로 작성해주세요.**
content 필드에 들어갈 내용만 작성하세요 (JSON 형식 아님).`;

    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 4096,
            }
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);

                    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                        reject(new Error('Invalid API response structure'));
                        return;
                    }

                    const content = data.candidates[0].content.parts[0].text;
                    resolve(content.trim());
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// 메인 실행 함수
async function generateMissingPosts() {
    console.log('🚀 Starting blog post generation for missing dates...\n');

    // 기존 content_db.js 읽기
    let contentDbContent = fs.readFileSync(CONTENT_DB_PATH, 'utf8');
    const dbMatch = contentDbContent.match(/const CONTENT_DB = ({[\s\S]*?});[\s\S]*?if \(typeof module/);

    if (!dbMatch) {
        throw new Error('Cannot parse CONTENT_DB');
    }

    const CONTENT_DB = eval(`(${dbMatch[1]})`);
    console.log(`📊 Current blog posts: ${CONTENT_DB.blog_posts.length}`);

    // 새 포스트 생성
    const newPosts = [];

    for (let i = 0; i < postsToGenerate.length; i++) {
        const postInfo = postsToGenerate[i];
        console.log(`\n📝 Generating post ${i + 1}/${postsToGenerate.length}: ${postInfo.topic}`);

        try {
            const content = await generateBlogContent(postInfo);

            const newPost = {
                id: postInfo.id,
                title: postInfo.title,
                date: postInfo.date,
                publishDate: postInfo.publishDate,
                content: content
            };

            newPosts.push(newPost);
            console.log(`   ✅ Generated successfully (${content.length} chars)`);

            // API rate limit 방지
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            console.error(`   ❌ Failed to generate: ${error.message}`);
            throw error;
        }
    }

    // 새 포스트를 blog_posts 배열 앞에 추가 (최신순 정렬)
    CONTENT_DB.blog_posts = [...newPosts, ...CONTENT_DB.blog_posts];

    // 파일에 저장
    const newContent = `const CONTENT_DB = ${JSON.stringify(CONTENT_DB, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONTENT_DB;
}
`;

    fs.writeFileSync(CONTENT_DB_PATH, newContent, 'utf8');

    console.log(`\n✅ Successfully added ${newPosts.length} new posts!`);
    console.log(`📊 Total blog posts: ${CONTENT_DB.blog_posts.length}`);
    console.log('\n📋 Generated posts:');
    newPosts.forEach(post => {
        console.log(`   - ID ${post.id} (${post.date}): ${post.title}`);
    });
}

// 실행
if (require.main === module) {
    generateMissingPosts()
        .then(() => {
            console.log('\n🎉 Blog post generation completed!');
            process.exit(0);
        })
        .catch(err => {
            console.error('\n💥 Fatal error:', err);
            process.exit(1);
        });
}

module.exports = { generateMissingPosts };
