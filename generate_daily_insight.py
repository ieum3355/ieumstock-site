import json
import os
from datetime import datetime, timedelta

# Path to the dynamic insights file
INSIGHTS_FILE = 'public/daily_insights.json'

# Expanded Research-grade topics for fallback/educational content
TOPICS = [
    {
        "title": "금리 동결과 시장의 반응: 기회인가 함정인가?",
        "slug": "interest-rate-impact-analysis",
        "category": "시장 분석",
        "introduction": {
            "heading": "변곡점에 선 금리 신호, 시장은 무엇을 읽고 있는가?",
            "text": "중앙은행의 금리 동결 결정이 내려졌습니다. 시장은 이를 호재로 받아들이는 듯하지만, 기저에 깔린 인플레이션 우려와 고금리 유지 기간(Higher for Longer)에 대한 불확실성은 여전합니다."
        },
        "core_analysis": [
            {
                "sub_heading": "1. 부채 부담과 기술주의 밸류에이션 재정렬",
                "text": "금리 동결은 단기적으로 기업의 이자 비용 부담을 덜어주지만, 고금리 상태의 지속은 장기적으로 성장주의 멀티플을 압박하는 요인입니다.",
                "insight_tip": "현금 비중을 30% 이상 유지하며 지지선을 확인하는 인내심이 필요합니다.",
                "icon_type": "risk"
            }
        ],
        "practical_guide": {
            "heading": "투자자 행동 강령: 하이브리드 대응",
            "items": [
                {
                    "title": "분할 매수의 원칙",
                    "description": "한 번에 전량을 매수하기보다, 지지선 확인 시마다 10%씩 물량을 늘려가는 보수적 접근이 유리합니다."
                }
            ]
        },
        "conclusion": {
            "text": "시장은 예측의 영역이 아니라 대응의 영역입니다. 금리 신호를 맹신하기보다 차트에 찍히는 거래량과 수급의 실체를 믿으십시오.",
            "closing_statement": "이음스탁이 당신의 흔들리지 않는 투자 기준이 되겠습니다."
        },
        "tags": ["금리동결", "시장분석", "투자전략", "거시경제", "수급분석"]
    },
    {
        "title": "세력의 매집봉 패턴 분석: 매수 타점 잡는 법",
        "slug": "major-buying-pattern-analysis",
        "category": "매매 기법",
        "introduction": {
            "heading": "차트 속 숨은 고수들의 흔적, 매집봉을 찾으십시오.",
            "text": "주가가 바닥권에서 대량 거래를 동반하며 윗꼬리를 다는 캔들은 흔히 '매집봉'이라 불립니다. 이는 세력이 물량을 테스트하고 매집을 진행 중이라는 강력한 신호입니다."
        },
        "core_analysis": [
            {
                "sub_heading": "1. 윗꼬리 캔들의 의미 해석",
                "text": "단순한 하락이 아니라 상단 매물을 소화하는 과정입니다. 이후 거래량이 줄어들며 캔들 몸통 하단을 지지해 준다면 완벽한 타점이 됩니다.",
                "insight_tip": "매집봉 출현 후 눌림목 구간이 최고의 진입 기회입니다.",
                "icon_type": "volume"
            }
        ],
        "practical_guide": {
            "heading": "매집봉 대응 매뉴얼",
            "items": [
                {
                    "title": "거래량 잠금 확인",
                    "description": "매집봉 이후 거래량이 전일 대비 20% 이하로 급감하면서 주가가 밀리지 않아야 합니다."
                }
            ]
        },
        "conclusion": {
            "text": "세력의 발자취를 따라가는 것만으로도 주식 시장의 상위 5%에 들 수 있습니다.",
            "closing_statement": "이음스탁이 당신의 기술적 안목을 키워드립니다."
        },
        "tags": ["매집봉", "영매공파", "기술적분석", "세력패턴", "차트분석"]
    }
]

def generate_insight():
    # Ensure public directory exists
    if not os.path.exists('public'):
        os.makedirs('public')

    # Load existing insights
    insights = []
    if os.path.exists(INSIGHTS_FILE):
        try:
            with open(INSIGHTS_FILE, 'r', encoding='utf-8') as f:
                insights = json.load(f)
        except:
            insights = []

    # Get today's date
    today = datetime.now().strftime("%Y.%m.%d")
    today_iso = datetime.now().strftime("%Y-%m-%d")
    
    # IMPROVED Duplicate Check: Check if today's post already exists
    today_has_insight = any(
        i.get('article_info', {}).get('date') == today
        for i in insights
    )
    
    if today_has_insight:
        print(f"Insight for {today} already exists. Skipping.")
        return

    # 1. Load Recommendation Data
    dashboard_data = {}
    try:
        with open('public/dashboard_data.json', 'r', encoding='utf-8-sig') as f:
            dashboard_data = json.load(f)
    except Exception as e:
        print(f"Warning: Could not read dashboard_data.json: {e}")
        pass

    recs = dashboard_data.get('recommendations', [])
    today_str = datetime.now().strftime("%y%m%d")

    # 2. Case Selection: Stock Analysis vs Educational Content
    if recs:
        # Pick the top recommended stock
        pick = recs[0]
        segments = pick['trading_strategy'].get('analysis_segments', {})
        
        title = f"오늘의 {pick['metadata']['tier']} 브레인 오프 타점: {pick['stock_info']['real_name']} 정밀 분석"
        intro_text = f"현재 시장 수급 및 기술적 지표 분석 결과, {pick['stock_info']['real_name']} 종목에서 강력한 에너지 응축이 포착되었습니다. 브레인 오프 엔진의 '영매공파' 필터를 통과한 {pick['metadata']['tier']} 등급 추천주입니다."
        
        content_body = {
            "introduction": {
                "heading": f"{pick['stock_info']['real_name']}, 왜 지금인가?",
                "text": intro_text
            },
            "core_analysis": [
                {
                    "sub_heading": "1. 실시간 돌파 감지 (SCANNING)",
                    "text": segments.get('breakout', "직전 고점 돌파 및 매물대 소화 과정을 실시간 추적하고 있습니다."),
                    "insight_tip": f"주요 저항 구역인 {pick['trading_strategy']['target_price']:,}원 돌파 여부가 핵심입니다.",
                    "icon_type": "analysis"
                },
                {
                    "sub_heading": "2. 메이저 수급 추적 (TRACKING)",
                    "text": segments.get('flow', "메이저 수급의 집중 매집 구간을 정밀 분석 중입니다."),
                    "insight_tip": "외국인/기관의 동반 순매수가 이어지는지 수급 창구를 확인하십시오.",
                    "icon_type": "volume"
                },
                {
                    "sub_heading": "3. 변동성 필터링 (VERIFIED)",
                    "text": segments.get('volatility', "시장 노이즈를 제거하고 순수 에너지를 측정하여 변동성 응축을 확인했습니다."),
                    "insight_tip": f"변동성 지표가 안정적인 {pick['metadata']['tier']} 등급 표준 수치 내에 머물러 있습니다.",
                    "icon_type": "risk"
                }
            ],
            "practical_guide": {
                "heading": "진짜 주도주를 선별하는 '상따' 체크리스트",
                "items": [
                    {
                        "title": "진입 구간 설정",
                        "description": f"{pick['trading_strategy']['entry_price']:,}원 부근에서의 분할 매수 접근이 유리합니다."
                    },
                    {
                        "title": "리스크 관리",
                        "description": f"손절가 {pick['trading_strategy']['stop_loss']:,}원 이탈 시 비중 축소 또는 청산 대응을 권장합니다."
                    }
                ]
            },
            "conclusion": {
                "text": f"{pick['stock_info']['real_name']}은 단기 스윙 관점에서 충분한 기대 수익률을 가진 종목입니다.",
                "closing_statement": "이음스탁의 AI 분석이 귀하의 성공 투자를 돕겠습니다."
            }
        }
        slug = f"analysis-{pick['metadata']['slug']}"
        tags = [pick['stock_info']['real_name'], pick['stock_info']['sector'], "브레인오프", "기술적분석", "영매공파"]
    else:
        # Educational/Strategy Content Case (No recommended stocks)
        # Cycle through TOPICS based on the day of the year
        day_of_year = datetime.now().timetuple().tm_yday
        topic = TOPICS[day_of_year % len(TOPICS)]
        
        title = topic['title']
        content_body = {
            "introduction": topic['introduction'],
            "core_analysis": topic['core_analysis'],
            "practical_guide": topic['practical_guide'],
            "conclusion": topic['conclusion']
        }
        slug = f"edu-{topic['slug']}-{today_str}"
        tags = topic['tags']

    new_insight = {
        "article_info": {
            "id": 2000 + len(insights),
            "slug": slug,
            "title": title,
            "author": "ieumstock AI Research",
            "date": today,
            "publishDate": today_iso,
            "category": "시장 분석" if not recs else "종목 분석",
            "tags": tags
        },
        "seo_metadata": {
            "meta_title": f"{title} | 이음스탁 투자 리포트",
            "meta_description": content_body["introduction"]["text"][:150],
            "og_image": "/assets/images/insight/default-insight.jpg"
        },
        "content_body": content_body,
        "system_link": {
            "target_tool": "Brain-Off Hybrid 2.1",
            "cta_text": "실시간 MVP 2.1 수급 분석으로 진짜 주도주 확인하기" if recs else "실시간 시장 지표 확인하기",
            "related_ticker": [p['stock_info']['ticker'] for p in recs] if recs else ["KOSPI", "KOSDAQ"]
        }
    }

    # Add to list and save
    insights.insert(0, new_insight) # Newest first
    
    with open(INSIGHTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(insights, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully generated dynamic insight for {today}")

if __name__ == "__main__":
    generate_insight()
