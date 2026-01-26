const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const DB_PATH = path.join(__dirname, '../data/content_db.js');
const MARKET_DATA_PATH = path.join(__dirname, '../data/market_data.json');
const MAX_RETRIES = 3;

/**
 * AI 자가 검증 및 자동 수정 시스템
 * 1. Critic Agent: 콘텐츠 검증 및 문제점 파악
 * 2. Fixer Agent: 문제점 자동 수정
 * 3. 재시도: 최대 3회까지 수정 시도
 * 4. 최종: 통과 시 업로드, 실패 시 알림
 */

async function callGemini(prompt) {
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
                        return reject(new Error("No candidates"));
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

// AI Critic: 콘텐츠 검증
async function criticContent(marketBrief, latestPost, marketData) {
    const today = new Date().toISOString().split('T')[0];

    const criticPrompt = `당신은 금융 콘텐츠 품질 검증 전문가입니다. 다음 콘텐츠를 엄격하게 검증하세요.

**오늘 날짜**: ${today}
**실제 시장 데이터**: 
- 코스피: ${marketData.korea.kospi} (${marketData.korea.kospiChangePercent}%)
- S&P 500: ${marketData.us.sp500.price} (${marketData.us.sp500.changePercent}%)
- 원/달러: ${marketData.forex.usdKrw}원 (${marketData.forex.usdKrwChangePercent}%)

**시장 브리핑**:
"${marketBrief}"

**최신 블로그 포스트** (ID: ${latestPost.id}, 날짜: ${latestPost.date}):
제목: "${latestPost.title}"
내용 샘플: "${latestPost.content.substring(0, 500)}..."

검증 항목 (매우 엄격하게):
1. **날짜 정확성**: 콘텐츠가 오늘(${today}) 기준인가? "어제", "지난주" 등 과거 시점 표현이 오늘 일처럼 쓰이지 않았는가?
2. **데이터 정확성**: 시장 브리핑과 블로그 본문의 수치가 실제 데이터(${marketData.korea.kospi}, ${marketData.forex.usdKrw} 등)와 소수점까지 일치하는가?
3. **금지 표현**: "저", "제가", "나", "주식 선배", "필자" 등 1인칭 또는 반말/존칭 혼용이 있는가?
4. **인코딩 및 오타**: 
   - "기업 적 개선" → "기업 실적 개선"과 같이 글자가 누락되거나 틀린 금융 용어가 있는가?
   - "기본적인 법" → "기본적인 방법"과 같이 조사가 어색하거나 단어가 잘린 부분이 있는가?
   - 깨진 한글이 포함되어 있는가?
5. **제어 문자 노출**: 텍스트 내부에 \\n, \\r\\n 같은 줄바꿈 제어 문자가 리터럴로 노출되어 있는가? (HTML 태그 <p>, <br>만 허용)
6. **어조의 일관성**: 선택한 어조(질책/공포/충고)가 끝까지 유지되는가?

JSON 형식으로만 응답:
{
  "passed": true/false,
  "issues": [
    {"type": "날짜/데이터/표현/오타/제어문자", "severity": "high/medium/low", "description": "구체적 문제", "location": "시장브리핑/블로그"},
    ...
  ],
  "score": 0-100,
  "recommendation": "통과/수정필요/재생성필요"
}`;

    try {
        const result = await callGemini(criticPrompt);
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return { passed: false, issues: [{ type: "파싱오류", description: "AI 응답 파싱 실패" }], score: 0 };
    } catch (e) {
        console.error('Critic Error:', e.message);
        return { passed: false, issues: [{ type: "오류", description: e.message }], score: 0 };
    }
}

// AI Fixer: 콘텐츠 자동 수정
async function fixContent(content, issues, type) {
    const issuesList = issues.map(i => `- ${i.type}: ${i.description}`).join('\n');

    const fixerPrompt = `당신은 금융 콘텐츠 수정 전문가입니다. 다음 ${type}을 수정하세요.

**원본 콘텐츠**:
"${content}"

**발견된 문제점**:
${issuesList}

**수정 지침**:
1. 1인칭 표현 절대 제거 ("저", "제가" → "투자자들", "시장 참여자들")
2. **오타 수정**: 금융 용어(실적, 방법, 가치 등) 오타를 문맥에 맞게 완벽히 수정.
3. **제어 문자 제거**: 텍스트 내의 \\n, \\r\\n 리터럴 문자를 실제 줄바꿈이나 공백으로 치환 (HTML 태그는 보존).
4. **데이터 동기화**: 실제 시장 데이터 수치와 본문 내 수치를 일치시킴.
5. 깨진 문자 복구 및 문법 교정.
6. 원본의 날카로운 톤을 유지하되 비문 제거.

JSON 형식으로만 응답:
{
  "fixed_content": "수정된 전체 내용 (제어 문자 제거됨)",
  "changes_made": ["변경사항1", "변경사항2", ...]
}`;

    try {
        const result = await callGemini(fixerPrompt);
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch (e) {
        console.error('Fixer Error:', e.message);
        return null;
    }
}

// 메인 검증 및 수정 루프
async function verifyAndFixContent() {
    console.log('🔍 Starting AI-powered content verification and auto-fix...\n');

    if (!API_KEY) {
        console.error('❌ GEMINI_API_KEY not set. Skipping AI verification.');
        process.exit(0); // 검증 없이 통과
    }

    try {
        // 1. 데이터 로드
        const dbContent = fs.readFileSync(DB_PATH, 'utf8');
        const marketData = JSON.parse(fs.readFileSync(MARKET_DATA_PATH, 'utf8'));

        const marketBriefMatch = dbContent.match(/"market_brief":\s*"([^"]+)"/);
        if (!marketBriefMatch) {
            console.error('❌ Market brief not found');
            process.exit(1);
        }

        const marketBrief = marketBriefMatch[1];

        // 최신 블로그 포스트 추출
        const postsMatch = dbContent.match(/"blog_posts":\s*\[([\s\S]*?)\n\s*\]/);
        let latestPost = null;
        if (postsMatch) {
            const firstPostMatch = postsMatch[1].match(/\{\s*"id":\s*(\d+),\s*"title":\s*"([^"]+)",\s*"date":\s*"([^"]+)",\s*"publishDate":\s*"([^"]+)",\s*"content":\s*"([\s\S]*?)"\s*\}/);
            if (firstPostMatch) {
                latestPost = {
                    id: firstPostMatch[1],
                    title: firstPostMatch[2],
                    date: firstPostMatch[3],
                    publishDate: firstPostMatch[4],
                    content: firstPostMatch[5].substring(0, 1000) // 샘플만
                };
            }
        }

        // 2. 검증 및 수정 루프
        let attempt = 0;
        let currentBrief = marketBrief;
        let passed = false;

        while (attempt < MAX_RETRIES && !passed) {
            attempt++;
            console.log(`\n📋 Attempt ${attempt}/${MAX_RETRIES}`);
            console.log('='.repeat(60));

            // Critic: 검증
            const criticism = await criticContent(currentBrief, latestPost, marketData);
            console.log(`\n🤖 AI Critic Score: ${criticism.score}/100`);

            if (criticism.issues && criticism.issues.length > 0) {
                console.log('\n⚠️  Issues found:');
                criticism.issues.forEach(issue => {
                    console.log(`   [${issue.severity || 'medium'}] ${issue.type}: ${issue.description}`);
                });
            }

            if (criticism.passed || criticism.score >= 80) {
                console.log('\n✅ Content passed verification!');
                passed = true;
                break;
            }

            if (attempt >= MAX_RETRIES) {
                console.log('\n❌ Max retries reached. Content quality not acceptable.');
                console.log('   Rolling back changes to prevent bad content upload.');

                // 원본으로 롤백
                fs.writeFileSync(DB_PATH, dbContent, 'utf8');
                console.log('   💾 Database rolled back to original');

                console.log('\n' + '='.repeat(60));
                console.log('📊 FINAL RESULT');
                console.log('='.repeat(60));
                console.log('Status: ❌ FAILED - Quality standards not met');
                console.log(`Attempts: ${attempt}/${MAX_RETRIES}`);
                console.log('Action: Changes rolled back, previous content preserved');
                console.log('='.repeat(60) + '\n');

                process.exit(1); // 검증 실패 시 배포 차단
            }

            // Fixer: 수정
            console.log('\n🔧 Attempting to fix issues...');
            const briefIssues = criticism.issues.filter(i => i.location === '시장브리핑' || !i.location);

            if (briefIssues.length > 0) {
                const fixed = await fixContent(currentBrief, briefIssues, '시장 브리핑');
                if (fixed && fixed.fixed_content) {
                    currentBrief = fixed.fixed_content;
                    console.log('   ✅ Market brief fixed');
                    if (fixed.changes_made) {
                        fixed.changes_made.forEach(change => {
                            console.log(`      - ${change}`);
                        });
                    }

                    // DB 업데이트
                    const updatedDb = dbContent.replace(
                        /"market_brief":\s*"[^"]+"/,
                        `"market_brief": "${currentBrief.replace(/"/g, '\\"')}"`
                    );
                    fs.writeFileSync(DB_PATH, updatedDb, 'utf8');
                    console.log('   💾 Database updated');
                } else {
                    console.log('   ⚠️  Auto-fix failed, retrying...');
                }
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 FINAL RESULT');
        console.log('='.repeat(60));
        console.log(`Status: ✅ PASSED - Content verified and ready for deployment`);
        console.log(`Attempts: ${attempt}/${MAX_RETRIES}`);
        console.log(`Final Score: ${passed ? '80+' : 'N/A'}/100`);
        console.log('='.repeat(60) + '\n');

        process.exit(0); // 검증 통과 시에만 배포 진행

    } catch (error) {
        console.error('\n💥 CRITICAL ERROR:', error.message);
        console.error('❌ Verification failed due to system error.');
        console.error('   Deployment blocked to prevent potential issues.');
        process.exit(1); // 오류 발생 시 배포 차단
    }
}

// 스크립트 실행
if (require.main === module) {
    verifyAndFixContent();
}

module.exports = { verifyAndFixContent };
