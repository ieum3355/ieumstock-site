import json
import os
from datetime import datetime, timedelta

# Path to the dynamic insights file
INSIGHTS_FILE = 'public/daily_insights.json'

# Research-grade topics and templates
TOPICS = [
    {
        "title": "금리 동결과 시장의 반응: 기회인가 함정인가?",
        "slug": "interest-rate-impact-analysis",
        "category": "시장 분석",
        "introduction": {
            "heading": "변곡점에 선 금리 신호, 시장은 무엇을 읽고 있는가?",
            "text": "중앙은행의 금리 동결 결정이 내려졌습니다. 시장은 이를 호재로 받아들이는 듯하지만, 기저에 깔린 인플레이션 우려와 고금리 유지 기간(Higher for Longer)에 대한 불확실성은 여전합니다. 단순히 동결이라는 결과보다 그 이면의 수급 논리를 파악해야 합니다."
        },
        "core_analysis": [
            {
                "sub_heading": "부채 부담과 기술주의 밸류에이션 재정렬",
                "text": "금리 동결은 단기적으로 기업의 이자 비용 부담을 덜어주지만, 고금리 상태의 지속은 장기적으로 성장주의 멀티플을 압박하는 요인입니다. 현재 나스닥 지수의 기술적 반등은 이러한 양면성이 충돌하는 구간입니다.",
                "insight_tip": "현금 비중을 30% 이상 유지하며 지지선을 확인하는 인내심이 필요합니다.",
                "icon_type": "risk"
            },
            {
                "sub_heading": "외국인 수급의 키, 달러 인덱스 추이",
                "text": "동결 결정 이후 달러가 약세로 전환될 경우 국내 증시로의 외국인 순매수가 유입될 가능성이 높습니다. 특히 반도체와 2차전지 대형주 위주의 수급 쏠림 현상을 주시하십시오.",
                "icon_type": "trend"
            }
        ],
        "practical_guide": {
            "heading": "투자자 행동 강령: 하이브리드 대응",
            "items": [
                {
                    "title": "분할 매수의 원칙",
                    "description": "한 번에 전량을 매수하기보다, 지지선 확인 시마다 10%씩 물량을 늘려가는 보수적 접근이 유리합니다."
                },
                {
                    "title": "섹터별 순환매 대비",
                    "description": "금리 민감도가 낮은 금융주와 실적 기반의 소비재를 포트폴리오의 방패로 사용하십시오."
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
        "title": "거래량 없는 상승을 경계해야 하는 이유",
        "slug": "warning-on-low-volume-rally",
        "category": "기술적 분석",
        "introduction": {
            "heading": "주가는 오르는데 거래량은 줄어든다? 에너지가 고갈되고 있습니다.",
            "text": "진짜 세력의 매집은 거래량을 숨길 수 없습니다. 최근 시장에서 관찰되는 '거래량 없는 상승'은 매도세가 일시적으로 실종된 것일 뿐, 새로운 매수 주체가 강력하게 유입된 것이 아님을 유의해야 합니다."
        },
        "core_analysis": [
            {
                "sub_heading": "하락 다이버전스의 징후 포착",
                "text": "가격은 고점을 높이는데 보조지표와 거래량이 낮아지는 현상은 조만간 강력한 추세 반전이 일어날 가능성이 큼을 의미합니다. 특히 5일 평균 거래량을 하회하는 양봉은 '속임수'일 확률이 80% 이상입니다.",
                "insight_tip": "거래량이 터지지 않는 돌파는 추격 매수의 금지 구역입니다.",
                "icon_type": "volume"
            },
            {
                "sub_heading": "심리적 저항선과 매물벽의 충돌",
                "text": "직전 고점 부근에서 거래량이 늘지 않는다면 이는 대기 매수세가 붙지 않는다는 뜻입니다. 개미 투자자들만 참여하는 시장은 사소한 악재에도 모래성처럼 무너집니다.",
                "icon_type": "psychology"
            }
        ],
        "practical_guide": {
            "heading": "안전한 엑시트를 위한 체크리스트",
            "items": [
                {
                    "title": "Stop-loss 타이트하게 설정",
                    "description": "상승분의 50%를 반납하는 시점에서는 기계적으로 수익을 실현하거나 비중을 줄이십시오."
                },
                {
                    "title": "거래량 급증 캔들 대기",
                    "description": "전일 대비 200% 이상의 거래량이 동반되는 장대양봉이 나올 때까지는 보수적으로 시장을 관망하십시오."
                }
            ]
        },
        "conclusion": {
            "text": "화려한 겉모습보다 내실을 보십시오. 주식 시장에서 내실은 곧 거래량입니다.",
            "closing_statement": "기다림도 투자입니다. 명확한 에너지가 확인될 때까지 인내하십시오."
        },
        "tags": ["거래량", "기술적분석", "다이버전스", "매매심리", "차트분석"]
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
    
    # Check if we already have a post for today
    if any(i.get('article_info', {}).get('date') == today or i.get('date') == today for i in insights):
        print(f"Insight for {today} already exists.")
        return

    # 1. Load Recommendation Data
    dashboard_data = {}
    try:
        with open('public/dashboard_data.json', 'r', encoding='utf-8') as f:
            dashboard_data = json.load(f)
    except:
        pass

    recs = dashboard_data.get('recommendations', [])
    today_str = datetime.now().strftime("%y%m%d")

    # 2. Case Selection: Stock Analysis vs Market Warning
    if recs:
        # Pick the top recommended stock (usually the first Premium)
        pick = recs[0]
        segments = pick['trading_strategy'].get('analysis_segments', {})
        
        title = f"오늘의 {pick['metadata']['tier']} 관점: {pick['stock_info']['real_name']} 정밀 분석"
        intro_text = f"현재 시장 수급 분석 결과, {pick['stock_info']['real_name']} 종목에서 유의미한 에너지 응축이 포착되었습니다. {pick['metadata']['tier']} 등급의 선정 기준인 {pick['score_card']['total_score']}점을 획득하며 기술적 필터를 통과했습니다."
        
        content_body = {
            "introduction": {
                "heading": f"{pick['stock_info']['real_name']}, 왜 지금인가?",
                "text": intro_text
            },
            "core_analysis": [
                {
                    "sub_heading": "실시간 돌파 감지 (SCANNING)",
                    "text": segments.get('breakout', "직전 고점 돌파 및 매물대 소화 과정을 실시간 추적하고 있습니다."),
                    "insight_tip": f"주요 저항 구역인 {pick['trading_strategy']['target_price']:,}원 돌파 여부가 핵심입니다.",
                    "icon_type": "analysis"
                },
                {
                    "sub_heading": "메이저 수급 추적 (TRACKING)",
                    "text": segments.get('flow', "메이저 수급의 집중 매집 구간을 정밀 분석 중입니다."),
                    "insight_tip": "외국인/기관의 동반 순매수가 이어지는지 수급 창구를 확인하십시오.",
                    "icon_type": "volume"
                },
                {
                    "sub_heading": "변동성 필터링 (VERIFIED)",
                    "text": segments.get('volatility', "시장 노이즈를 제거하고 순수 에너지를 측정하여 변동성 응축을 확인했습니다."),
                    "insight_tip": "변동성 지표가 안정적인 {pick['metadata']['tier']} 등급 표준 수치 내에 머물러 있습니다.",
                    "icon_type": "risk"
                }
            ],
            "practical_guide": {
                "heading": "대응 가이드라인",
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
        tags = [pick['stock_info']['real_name'], pick['stock_info']['sector'], "AI추천", "기술적분석"]
    else:
        # Market Warning Case
        status_msg = dashboard_data.get('generation_info', {}).get('status_msg', "시장 변동성 확인 중")
        title = "현재 시장 상황이 좋지 않아 추천 종목이 없습니다 (관망 권장)"
        content_body = {
            "introduction": {
                "heading": "보수적 관망이 필요한 구간입니다",
                "text": f"현재 {status_msg} AI 엔진의 정밀 스캔 결과, 안정적인 수익 확률을 보장할 수 있는 고득점 종목이 포착되지 않았습니다."
            },
            "core_analysis": [
                {
                    "sub_heading": "무리한 매매보다 현금 비중 확대",
                    "text": "지수의 하방 압력이 강하거나 주도 섹터의 에너지가 분산되는 시기에는 휴식도 투자입니다. 억지로 종목을 매수하기보다 다음 주도주를 기다리는 인내심이 필요합니다.",
                    "insight_tip": "현금을 보유하는 것 또한 하나의 포지션입니다.",
                    "icon_type": "risk"
                }
            ],
            "practical_guide": {
                "heading": "현재 구간 대응 전략",
                "items": [
                    {
                        "title": "기존 보유 종목 점검",
                        "description": "추가 매수보다는 기대 수익률이 훼손된 종목의 비중을 조절하는 시기로 활용하십시오."
                    },
                    {
                        "title": "차기 주도주 모니터링",
                        "description": "지수 반등 시 가장 먼저 올라올 섹터를 미리 선별해 두는 공부의 시간으로 삼으십시오."
                    }
                ]
            },
            "conclusion": {
                "text": "시장이 안정화되고 확률 높은 종목이 포착되는 즉시 다시 분석 보고서를 발행하겠습니다.",
                "closing_statement": "기다림 끝에 가장 달콤한 수익이 옵니다."
            }
        }
        slug = f"market-warning-{today_str}"
        tags = ["시장주의", "관망권고", "리스크관리", "AI분석", "이음스탁"]

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
            "target_tool": "BrainOff",
            "related_ticker": ["KOSPI", "KOSDAQ", "KOSPI 200", "KOSDAQ 150", "KODEX 200", "TIGER 2차전지테마"]
        }
    }

    # Add to list and save
    insights.insert(0, new_insight) # Newest first
    
    with open(INSIGHTS_FILE, 'w', encoding='utf-8-sig') as f:
        json.dump(insights, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully generated dynamic insight for {today}")

if __name__ == "__main__":
    generate_insight()
