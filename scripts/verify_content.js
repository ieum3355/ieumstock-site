const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const DB_PATH = path.join(__dirname, '../data/content_db.js');
const MARKET_DATA_PATH = path.join(__dirname, '../data/market_data.json');

/**
 * AI 기반 콘텐츠 검증 스크립트
 * 생성된 콘텐츠의 정확성, 품질, 최신성을 검증
 */

async function callGeminiVerification(prompt) {
    const data = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
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
                    if (!result.candidates || !result.candidates[0]) {
                        return reject(new Error("No candidates in response"));
                    }
                    resolve(result.candidates[0].content.parts[0].text);
                } catch (e) {
                    reject(new Error(`Parse Error: ${e.message}`));
                }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function verifyContent() {
    console.log('🔍 Starting content verification...\n');

    const errors = [];
    const warnings = [];

    try {
        // 1. 파일 존재 확인
        if (!fs.existsSync(DB_PATH)) {
            errors.push('❌ content_db.js file not found');
            throw new Error('Critical file missing');
        }

        if (!fs.existsSync(MARKET_DATA_PATH)) {
            errors.push('❌ market_data.json file not found');
            throw new Error('Critical file missing');
        }

        // 2. 데이터 로드
        const dbContent = fs.readFileSync(DB_PATH, 'utf8');
        const marketData = JSON.parse(fs.readFileSync(MARKET_DATA_PATH, 'utf8'));

        // 3. 날짜 검증
        console.log('📅 Checking date accuracy...');
        const today = new Date().toISOString().split('T')[0];

        if (marketData.date !== today) {
            errors.push(`❌ Market data is outdated: ${marketData.date} (expected: ${today})`);
        } else {
            console.log(`   ✅ Market data date is current: ${today}`);
        }

        // 4. 시장 브리핑 추출
        const marketBriefMatch = dbContent.match(/"market_brief":\s*"([^"]+)"/);
        if (!marketBriefMatch) {
            errors.push('❌ Market brief not found in content_db.js');
        } else {
            const marketBrief = marketBriefMatch[1];
            console.log('\n📰 Verifying market brief...');
            console.log(`   Brief: "${marketBrief.substring(0, 100)}..."`);

            // 5. 금지 표현 검사
            const forbiddenWords = ['저', '제가', '나', '주식 선배', '선배로서'];
            const foundForbidden = forbiddenWords.filter(word => marketBrief.includes(word));

            if (foundForbidden.length > 0) {
                errors.push(`❌ Forbidden words found in market brief: ${foundForbidden.join(', ')}`);
            } else {
                console.log('   ✅ No forbidden first-person expressions');
            }

            // 6. 인코딩 문제 검사
            const encodingIssues = marketBrief.match(/\\u[0-9a-fA-F]{4}|�|â€|Ã/g);
            if (encodingIssues) {
                errors.push(`❌ Encoding issues detected: ${encodingIssues.join(', ')}`);
            } else {
                console.log('   ✅ No encoding issues detected');
            }
        }

        // 7. 최신 블로그 포스트 검증
        console.log('\n📝 Verifying latest blog post...');
        const blogPostsMatch = dbContent.match(/"blog_posts":\s*\[([\s\S]*?)\n\s*\]/);

        if (blogPostsMatch) {
            const postsContent = blogPostsMatch[1];
            const firstPostMatch = postsContent.match(/\{\s*"id":\s*(\d+),\s*"title":\s*"([^"]+)",\s*"date":\s*"([^"]+)",\s*"publishDate":\s*"([^"]+)"/);

            if (firstPostMatch) {
                const [, id, title, date, publishDate] = firstPostMatch;
                console.log(`   Latest post: #${id} - "${title}"`);
                console.log(`   Date: ${date} (${publishDate})`);

                // 날짜 검증
                const postDate = new Date(publishDate);
                const todayDate = new Date(today);
                const daysDiff = Math.floor((todayDate - postDate) / (1000 * 60 * 60 * 24));

                if (daysDiff > 2) {
                    warnings.push(`⚠️  Latest blog post is ${daysDiff} days old`);
                } else {
                    console.log(`   ✅ Post is recent (${daysDiff} days old)`);
                }

                // 금지 표현 검사 (샘플)
                const contentSample = postsContent.substring(0, 2000);
                const forbiddenInPost = forbiddenWords.filter(word => contentSample.includes(word));

                if (forbiddenInPost.length > 0) {
                    errors.push(`❌ Forbidden words found in blog post: ${forbiddenInPost.join(', ')}`);
                } else {
                    console.log('   ✅ No forbidden expressions in post sample');
                }
            }
        }

        // 8. AI 기반 콘텐츠 품질 검증 (선택적)
        if (API_KEY && marketBriefMatch) {
            console.log('\n🤖 Running AI quality verification...');

            const verificationPrompt = `다음 시장 브리핑 텍스트를 검증해주세요:

"${marketBriefMatch[1]}"

검증 항목:
1. 과거 시제 표현이 있는가? (예: "어제", "지난주", "했습니다" 등)
2. 구체적인 날짜나 과거 데이터를 언급하는가?
3. 문법적으로 자연스러운가?
4. 1인칭 표현이 있는가? ("저", "제가", "나" 등)

JSON 형식으로만 응답:
{
  "hasPastTense": true/false,
  "hasSpecificDates": true/false,
  "isNaturalGrammar": true/false,
  "hasFirstPerson": true/false,
  "issues": ["문제점 리스트"],
  "score": 0-100
}`;

            try {
                const aiResult = await callGeminiVerification(verificationPrompt);
                const jsonMatch = aiResult.match(/\{[\s\S]*\}/);

                if (jsonMatch) {
                    const verification = JSON.parse(jsonMatch[0]);
                    console.log(`   AI Quality Score: ${verification.score}/100`);

                    if (verification.hasPastTense) {
                        warnings.push('⚠️  AI detected past tense expressions');
                    }

                    if (verification.hasFirstPerson) {
                        errors.push('❌ AI detected first-person expressions');
                    }

                    if (verification.issues && verification.issues.length > 0) {
                        console.log('   Issues found:');
                        verification.issues.forEach(issue => console.log(`     - ${issue}`));
                    }

                    if (verification.score < 70) {
                        errors.push(`❌ AI quality score too low: ${verification.score}/100`);
                    } else {
                        console.log('   ✅ AI verification passed');
                    }
                }
            } catch (e) {
                console.log(`   ⚠️  AI verification skipped: ${e.message}`);
            }
        }

        // 9. 결과 출력
        console.log('\n' + '='.repeat(60));
        console.log('📊 VERIFICATION RESULTS');
        console.log('='.repeat(60));

        if (warnings.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            warnings.forEach(w => console.log(`   ${w}`));
        }

        if (errors.length > 0) {
            console.log('\n❌ ERRORS:');
            errors.forEach(e => console.log(`   ${e}`));
            console.log('\n💥 VERIFICATION FAILED - Content quality issues detected!');
            process.exit(1);
        }

        console.log('\n✅ ALL CHECKS PASSED - Content is verified and ready!');
        console.log('='.repeat(60) + '\n');
        process.exit(0);

    } catch (error) {
        console.error('\n💥 VERIFICATION ERROR:', error.message);
        errors.forEach(e => console.log(`   ${e}`));
        process.exit(1);
    }
}

// 스크립트 실행
if (require.main === module) {
    verifyContent();
}

module.exports = { verifyContent };
