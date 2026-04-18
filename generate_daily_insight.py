import json
import os
from datetime import datetime, timedelta

# Path to the dynamic insights file
INSIGHTS_FILE = 'public/daily_insights.json'

# High-quality, long-form topics for fallback/educational content
TOPICS = [
    {
        "category": "Investment Insight",
        "title": "상한가 따라잡기(상따), 세력의 설거지를 피하는 3가지 필승 전략",
        "slug": "truth-of-upper-limit-price-trading",
        "author": "ieumstock AI Lab",
        "tags": ["상한가매매", "상따전략", "세력패턴", "기술적분석", "리스크관리"],
        "introduction": {
            "heading": "탐욕과 공포가 교차하는 상한가, 당신은 준비되었습니까?",
            "text": "주식 시장에서 상한가는 모든 투자자의 시선을 사로잡는 화려한 불꽃과 같습니다. '내일도 상승할 것'이라는 탐욕과 '나만 소외될지 모른다'는 공포가 개미 투자자들을 상한가 잔량 속으로 끌어들입니다. 하지만 준비되지 않은 상한가 매매(상따)는 세력의 차익 실현을 돕는 '설거지'의 희생양이 되기 십상입니다."
        },
        "core_analysis": [
            {
                "sub_heading": "1. 세력은 왜 상한가를 '설계'하는가?",
                "text": "세력에게 상한가는 단순한 상승 이상의 의미를 가집니다. 대량의 물량을 개인에게 넘기기 위해 시장의 관심을 극대화하는 '꽃길'을 까는 작업입니다. 특히 거래량이 실리지 않은 채 장 막판에 억지로 문을 닫는 상한가는 익일 갭하락 가능성이 매우 높은 위험 신호입니다.",
                "insight_tip": "상한가는 개미를 가두기 위한 가장 화려한 감옥이 될 수 있음을 명심하십시오."
            },
            {
                "sub_heading": "2. 기회비용의 증발: 보이지 않는 손실",
                "text": "잘못된 상따로 계좌가 묶이는 순간, 진짜 주도주가 터질 때 진입할 수 있는 '자금의 유동성'이 사라집니다. 글로벌 경제의 불확실성이 커지는 시기에 개별 테마주에 자금이 묶이는 것은 단순 손실을 넘어 투자 기회 자체를 박탈당하는 결과를 초래합니다.",
                "insight_tip": "수급의 질을 파악하는 것이 우선입니다."
            }
        ],
        "practical_guide": {
            "heading": "진짜 주도주를 선별하는 '상따' 체크리스트",
            "items": [
                {
                    "title": "시간의 법칙",
                    "description": "오전 10시 이전에 강력하게 문을 닫은 종목일수록 익일 상승 확률이 비약적으로 높습니다."
                },
                {
                    "title": "테마의 응집력",
                    "description": "단독 종목의 호재보다 해당 업종 전체가 함께 움직이는 주도 테마의 대장주여야 합니다."
                },
                {
                    "title": "거래량 잠금 상태",
                    "description": "상한가 안착 후 잔량이 줄어들지 않고 거래량이 소멸된 상태로 유지되어야 진정한 '잠금'입니다."
                }
            ]
        },
        "conclusion": {
            "text": "상한가는 부의 지름길이 될 수도 있지만, 누군가에겐 파산의 덫입니다. 공급망과 인플레이션이 요동치는 거친 시장에서 내 돈을 지키는 유일한 방법은 냉정한 판단력뿐입니다. 세력이 파놓은 구덩이에 스스로 걸어 들어가지 마십시오.",
            "closing_statement": "투자는 원칙의 산물입니다. 이음스탁이 당신의 흔들리지 않는 원칙이 되겠습니다."
        }
    },
    {
        "category": "Technical Analysis",
        "title": "공구리 패턴: 바닥권 매수 타점의 정석과 세력의 매집 원리",
        "slug": "concrete-pattern-mastery",
        "author": "ieumstock AI Lab",
        "tags": ["공구리패턴", "바닥탈출", "세력매집", "영매공파", "가치투자"],
        "introduction": {
            "heading": "무너지지 않는 바닥, '공구리'를 이해하면 수익이 보입니다.",
            "text": "주가가 장기 하락을 멈추고 특정 가격대를 지지하며 횡보하는 현상을 '공구리를 친다'고 표현합니다. 이는 하락 에너지가 소멸되고 새로운 매수 주체가 바닥을 다지고 있다는 신호입니다."
        },
        "core_analysis": [
            {
                "sub_heading": "1. 장기 이평선 역배열의 수렴",
                "text": "112일선, 224일선 등 장기 이동평균선이 주가와 맞닿으며 수렴하는 구간이 공구리의 핵심입니다. 이 구간에서 주가가 이평선 위로 올라타는 순간이 바로 '영매공파'의 핵심 타점입니다.",
                "insight_tip": "이평선이 꼬여있는 구간에서 거래량이 터지는 캔들을 찾으십시오."
            },
            {
                "sub_heading": "2. 바닥권 매집봉의 출현",
                "text": "공구리 구간 내에서 윗꼬리가 긴 매집봉이 자주 출현한다면 이는 세력이 물량을 테스트하고 있다는 명백한 증거입니다.",
                "insight_tip": "매집봉의 저점을 깨지 않는 흐름이 유지되어야 합니다."
            }
        ],
        "practical_guide": {
            "heading": "공구리 타점 실전 공략법",
            "items": [
                {
                    "title": "박스권 하단 매수",
                    "description": "공구리 구간의 저점을 손절가로 잡고, 박스권 하단에서 분할 매수로 접근하는 것이 가장 안전합니다."
                },
                {
                    "title": "256 기법과의 조화",
                    "description": "5일선이 20일선을 돌파하는 골든크로스와 공구리 돌파가 동시에 일어나는 지점이 승률 90% 이상의 급등 타점입니다."
                }
            ]
        },
        "conclusion": {
            "text": "급등주를 쫓아가는 것보다 바닥을 확인하고 기다리는 투자가 훨씬 수익률이 높습니다.",
            "closing_statement": "안전한 투자의 시작, 이음스탁이 바닥을 찾아드립니다."
        }
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
