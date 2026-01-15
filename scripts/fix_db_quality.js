const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;
const DB_PATH = path.join(__dirname, '../data/content_db.js');

const REWRITE_PROMPT = `당신은 금융 수석 전략가 '이음스탁'입니다. 
다음 주식 투자 관련 주제에 대해 '기본적 분석(산업/매커니즘)'과 '기술적 분석(차트/보조지표)'을 융합하여 
공백 제외 1000자 이상의 매우 상세하고 전문적인 블로그 포스팅을 작성하세요.

## 필수 포함:
- 투자자들의 실제 가상 사례 (예: 차트에서 RSI가 30 이하로 내려갔을 때~)
- 기업의 펀더멘털 분석 로직 (왜 실적이 중요한지)
- 3가지 핵심 체크리스트 (HTML <ul> 사용)
- 소제목 <h3> 사용, 강조 <strong> 사용.
- 말투: 세련된 백화점 매니저 톤 (~입니다).
- 반드시 JSON 형식으로만 응답: {"title": "제목", "content": "내용(HTML)"}

주제: `;

async function callAI(prompt) {
    const data = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
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
                    resolve(result.candidates[0].content.parts[0].text);
                } catch (e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

const topics = [
    "2026년 주도주 분석: AI 반도체와 HBM의 미래",
    "금리 인하 시나리오별 포트폴리오 대응 전략",
    "차트의 신호: 골든크로스와 데드크로스 완벽 정복",
    "가치 투자의 정석: 재무제표 읽는 법과 저평가주 발굴",
    "배당주 투자로 만드는 제2의 월급: 배당 귀족주 선별법",
    "거래량 분석의 비밀: 주가는 속여도 거래량은 못 속인다",
    "리스크 관리: 손절매 원칙과 비중 조절의 기술",
    "투자 심리학: 하락장에서 흔들리지 않는 멘탈 관리법",
    "볼린저 밴드와 RSI를 활용한 기막힌 매수 타점",
    "테마주 매매의 정석: 대장주 포착과 재료 분석법",
    "워런 버핏의 경제적 해자: 독점적 기업을 찾는 눈",
    "MACD와 스토캐스틱을 활용한 추세 추종 매매",
    "미국 주식 vs 한국 주식: 시장별 특징과 투자 전략",
    "ISA와 연금저축을 활용한 스마트한 절세 투자",
    "주린이를 위한 이동평균선 매매 이론 완벽 가이드"
];

async function run() {
    const newPosts = [];
    const today = new Date();

    for (let i = 0; i < topics.length; i++) {
        console.log(`Generating topic ${i + 1}/${topics.length}: ${topics[i]}`);
        const resultRaw = await callAI(REWRITE_PROMPT + topics[i]);
        const jsonMatch = resultRaw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            const pubDate = new Date(today);
            pubDate.setDate(today.getDate() - i); // Each post 1 day apart

            newPosts.push({
                id: 200 - i,
                title: data.title,
                date: pubDate.toISOString().split('T')[0].replace(/-/g, '.'),
                publishDate: pubDate.toISOString().split('T')[0],
                content: data.content
            });
        }
    }

    const marketBrief = `오늘의 시장은 미국 국채 금리 하락과 함께 빅테크 기업들의 실적 기대감이 반영되며 전반적인 안도 랠리를 보여주었습니다. 특히 반도체 섹터에서의 외인 매수세가 강하게 유입되었는데, 이는 하반기 업황 회복에 대한 확신이 시장에 퍼지고 있음을 의미합니다. 초보 투자자 여러분은 지수가 올랐다고 해서 추격 매수를 하기보다는, 주요 저항선 돌파 여부를 확인한 뒤 분할 매수로 접근하는 원칙을 지키시길 권장합니다. 환율이 요동치는 구간인 만큼 수출 위주의 대형주 실적을 면밀히 관찰해야 하는 시점입니다.`;

    const dbContent = fs.readFileSync(DB_PATH, 'utf8');
    const updatedDb = `const CONTENT_DB = {
    "market_brief": "${marketBrief}",
    "terms": [
        {
            "keyword": "PER (주가수익비율)",
            "description": "현재 주가가 1주당 순이익의 몇 배인지 나타내는 지표입니다. 낮을수록 저평가되었다고 봅니다."
        },
        {
            "keyword": "PBR (주가순자산비율)",
            "description": "주가를 1주당 순자산으로 나눈 값입니다. 1 미만이면 회사의 자산 가치보다 주가가 낮다는 뜻입니다."
        },
        {
            "keyword": "매수 vs 매도",
            "description": "매수는 주식을 사는 것, 매도는 주식을 파는 것입니다. 붉은색은 상승, 파란색은 하락을 의미합니다."
        },
        {
            "keyword": "ROE (자기자본이익률)",
            "description": "기업이 자본을 이용해 얼만큼의 이익을 냈는지 나타내는 지표입니다. 높을수록 성장성이 높은 기업일 가능성이 큽니다."
        },
        {
            "keyword": "EPS (주당순이익)",
            "description": "기업이 벌어들인 순이익을 발행주식수로 나눈 값입니다. 1주당 얼마의 이익을 창출했는지를 보여줍니다."
        }
    ],
    "mistakes": [
        {
            "title": "급등주 추격 매수",
            "desc": "이미 20% 이상 오른 종목은 고점일 확률이 높습니다. 눌림목을 기다리세요.",
            "bad": "뉴스가 뜨자마자 풀매수",
            "good": "조정 시 지지선 확인 후 분할 매수"
        },
        {
            "title": "근거 없는 물타기",
            "desc": "손절 라인을 어기고 계속 사면 비중만 커지고 손실이 눈덩이처럼 불어납니다.",
            "bad": "내리니까 그냥 더 산다",
            "good": "기업 가치 훼손 여부 판단 후 전략적 대응"
        }
    ],
    "guides": [
        {
            "title": "주계좌 설정법",
            "content": "자산의 70%는 우량주, 30%는 현금 또는 단기 매매용으로 분리하세요."
        },
        {
            "title": "차트 보는 순서",
            "content": "월봉(큰 추세) -> 주봉(중기 흐름) -> 일봉(진입 타점) 순으로 보세요."
        }
    ],
    "faqs": [
        {
            "question": "주식은 언제 팔아야 하나요?",
            "answer": "내가 산 이유가 사라졌을 때, 혹은 목표 수익률에 도달했을 때 기계적으로 파는 것이 좋습니다."
        },
        {
            "question": "분할 매수가 왜 중요한가요?",
            "answer": "진입 시점의 위험을 분산하고, 평균 단가를 유리하게 관리할 수 있기 때문입니다."
        }
    ],
    "books": [
        {
            "title": "전설로 떠나는 월가의 영웅",
            "author": "피터 린치",
            "desc": "일상 속에서 위대한 기업을 찾는 법을 가르쳐주는 필독서입니다."
        },
        {
            "title": "주식 투자 법칙",
            "author": "제시 리버모어",
            "desc": "추세 매매의 선구자가 전하는 투자 심리와 기법의 정수입니다."
        }
    ],
    "quotes": [
        {
            "text": "위험은 자신이 무엇을 하는지 모르는 데서 온다.",
            "author": "워런 버핏"
        },
        {
            "text": "시장은 인내심 없는 사람의 돈을 인내심 있는 사람에게 옮기는 도구이다.",
            "author": "워런 버핏"
        }
    ],
    "quizzes": [
        {
            "id": 1,
            "question": "기업이 벌어들인 순이익을 주식수로 나눈 값은?",
            "options": ["PER", "PBR", "EPS", "ROE"],
            "answer": 2,
            "desc": "EPS는 주당순이익으로 기업의 수익성을 나타내는 핵심 지표입니다."
        }
    ],
    "blog_posts": ${JSON.stringify(newPosts, null, 8)}
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONTENT_DB;
}
`;
    fs.writeFileSync(DB_PATH, updatedDb, 'utf8');
}

run();
