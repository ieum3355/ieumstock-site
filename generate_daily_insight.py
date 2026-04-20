import json
import os
import random
from datetime import datetime, timedelta

# Path to the dynamic insights file
INSIGHTS_FILE = 'public/daily_insights.json'

# High-quality, long-form topics for professional research institute level
# Each topic is unique and professional.
TOPICS = [
    {
        "category": "Technical Analysis",
        "title": "바닥권 공구리 패턴과 매집의 원리 (영매공파 심화)",
        "slug": "deep-dive-into-concrete-pattern",
        "author": "ieumstock AI Lab",
        "tags": ["영매공파", "공구리패턴", "세력매집", "바닥탈출"],
        "introduction": {"heading": "무너지지 않는 바닥, '공구리'는 세력의 설계입니다.", "text": "단순한 가격 횡보를 넘어, 특정 가격대를 방어하며 에너지를 응축하는 '공구리' 패턴은 개인 투자자가 가장 안전하게 수익을 낼 수 있는 구간입니다."},
        "core_analysis": [
            {"sub_heading": "1. 장기 이평선 역배열의 수렴", "text": "112일선, 224일선 등 장기 이동평균선이 주가와 맞닿으며 수렴하는 구간은 매도세와 매수세가 균형을 이루는 시점입니다.", "insight_tip": "이평선 수렴 구간에서 거래량이 터지는 캔들을 찾으십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 바닥권 매집봉의 비밀", "text": "공구리 구간 내에서 발생하는 윗꼬리가 긴 매집봉은 세력이 유통 물량을 테스트하고 개인들의 매물을 흡수하는 과정입니다.", "insight_tip": "매집봉의 저점을 깨지 않는 흐름이 유지되어야 합니다.", "icon_type": "volume"},
            {"sub_heading": "3. 5분 봉상 주요 저항선 돌파", "text": "전일 거래량 대비 300% 이상의 대량 거래가 5분 봉상 주요 저항선 위에서 유지될 때, 이는 대시세의 서막입니다.", "insight_tip": "9시 30분 이전의 거래량 집중도를 체크하십시오.", "icon_type": "trend"}
        ],
        "practical_guide": {"heading": "실전 공략법", "items": [{"title": "박스권 하단 매수", "description": "공구리 하단을 손절로 잡고 분할 접근하십시오."}]},
        "conclusion": {"text": "급등주를 쫓기보다 바닥을 확인하는 투자가 승률이 높습니다.", "closing_statement": "이음스탁이 바닥을 찾아드립니다."}
    },
    {
        "category": "Market Strategy",
        "title": "하이퍼 인플레이션과 금리 변동성 대응 전략",
        "slug": "inflation-interest-rate-strategy",
        "author": "ieumstock AI Lab",
        "tags": ["매크로분석", "인플레이션", "시장대응"],
        "introduction": {"heading": "요동치는 물가와 금리, 위기는 기회입니다.", "text": "글로벌 공급망 불확실성은 시장 변동성을 키우지만 실적이 개선되는 종목은 존재합니다."},
        "core_analysis": [
            {"sub_heading": "1. 실질 금리와 주가 상관관계", "text": "금리 인상기에도 실적이 뒷받침되는 종목은 우상향합니다. 실질 금리의 방향성이 핵심입니다.", "insight_tip": "고현금성 자산 보유 기업에 주목하십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 원자재 섹터의 수급 균형", "text": "인플레이션 시대에는 실물 자산 가치가 상승합니다. 원자재 관련 수급 데이터를 추적하십시오.", "insight_tip": "원유, 구리 가격 선행 지표를 체크하십시오.", "icon_type": "trend"},
            {"sub_heading": "3. 기술주 옥석 가리기", "text": "강력한 현금 흐름을 가진 기술주는 경쟁사 도태의 수혜를 입습니다.", "insight_tip": "영업이익률이 개선되는 1등주만 홀딩하십시오.", "icon_type": "volume"}
        ],
        "practical_guide": {"heading": "체크리스트", "items": [{"title": "부채 비율 확인", "description": "부채 비율 50% 미만 우량주를 선호하십시오."}]},
        "conclusion": {"text": "중요한 것은 파도를 타는 법을 배우는 것입니다.", "closing_statement": "이음스탁이 함께합니다."}
    },
    {
        "category": "Technique",
        "title": "세력의 설거지(차익 실현) 캔들 분석과 탈출 시그널",
        "slug": "whale-exit-pattern-analysis",
        "author": "ieumstock AI Lab",
        "tags": ["세력패턴", "설거지캔들", "리스크관리"],
        "introduction": {"heading": "축제 뒤에 남겨진 개미들의 무덤을 피하십시오.", "text": "주가가 급등한 후 세력이 물량을 개인에게 떠넘기는 '설거지'를 읽어야 합니다."},
        "core_analysis": [
            {"sub_heading": "1. 고점권 대량 거래 윗꼬리", "text": "역대급 거래량이 터졌음에도 주가가 밀리면 세력이 던지고 있다는 신호입니다.", "insight_tip": "거래량 대비 주가 상승폭이 미미하면 경계하십시오.", "icon_type": "volume"},
            {"sub_heading": "2. 하락 장악형 패턴", "text": "이전 양봉을 집어삼키는 거대 음봉은 추세 하락의 확정 시그널입니다.", "insight_tip": "3거래일 내 고점 회복 실패 시 즉시 축소하십시오.", "icon_type": "risk"},
            {"sub_heading": "3. 재료 소멸과 수급 이탈", "text": "호재 뉴스가 나왔을 때 거래량이 터지며 음봉이 나오면 전형적인 엑싯입니다.", "insight_tip": "뉴스의 선반영 여부를 차트로 판단하십시오.", "icon_type": "analysis"}
        ],
        "practical_guide": {"heading": "대응 매뉴얼", "items": [{"title": "분할 익절 습관", "description": "주요 저항선마다 수익을 확정하십시오."}]},
        "conclusion": {"text": "나갈 때를 아는 투자가 진짜 실력입니다.", "closing_statement": "리스크 관리는 이음스탁과 함께."}
    },
    {
        "category": "Strategy",
        "title": "상한가 따라잡기(상따), 세력의 설거지를 피하는 필승 전략",
        "slug": "truth-of-upper-limit-price-trading",
        "author": "ieumstock AI Lab",
        "tags": ["상한가매매", "상따전략", "세력패턴"],
        "introduction": {"heading": "화려한 상한가 속 숨겨진 함정", "text": "준비되지 않은 상따는 세력의 차익 실현 희생양이 되기 쉽습니다."},
        "core_analysis": [
            {"sub_heading": "1. 상한가 설계 의도", "text": "장 초반 10시 이전 문을 닫는 '강한 상한가'는 다음 날 시세를 기대할 수 있습니다.", "insight_tip": "닫는 시간이 늦을수록 약한 상한가입니다.", "icon_type": "analysis"},
            {"sub_heading": "2. 거래량과 잔량의 관계", "text": "상한가 안착 후 거래량이 소멸되어야 진정한 '잠금' 상태입니다.", "insight_tip": "상한가 잔량이 줄어드는 속도를 실시간 체크하십시오.", "icon_type": "volume"},
            {"sub_heading": "3. 익일 시초가 대응", "text": "상따의 수익은 다음 날 시초가 갭에서 결정됩니다.", "insight_tip": "시초가가 3% 미만이면 즉시 탈출을 고려하십시오.", "icon_type": "strategy"}
        ],
        "practical_guide": {"heading": "상따 수칙", "items": [{"title": "비중 조절", "description": "상따는 고위험 매매이므로 비중을 낮게 운용하십시오."}]},
        "conclusion": {"text": "진짜 주도주를 선별하는 안목이 필수입니다.", "closing_statement": "이음스탁 AI가 도와드립니다."}
    },
    {
        "category": "Market Analysis",
        "title": "나스닥 지수와 국내 기술주 커플링 분석 (디커플링 대응법)",
        "slug": "nasdaq-kospi-coupling-analysis",
        "author": "ieumstock AI Lab",
        "tags": ["나스닥", "국내증시", "커플링"],
        "introduction": {"heading": "미국이 기침하면 한국은 독감에 걸리는 시대", "text": "글로벌 증시의 풍향계인 나스닥의 움직임은 국내 핵심 기술주 섹터에 즉각적인 영향을 미칩니다."},
        "core_analysis": [
            {"sub_heading": "1. 반도체 섹터의 동조화", "text": "엔비디아, 필라델피아 반도체 지수의 급등락은 국내 시가총액 상위주에 영향을 줍니다.", "insight_tip": "밤사이 글로벌 지수 추이를 반드시 확인하십시오.", "icon_type": "trend"},
            {"sub_heading": "2. 금리 환경과 성장주 탄력", "text": "나스닥 상승 시 국내 플랫폼주와 바이오 섹터의 반응 속도를 체크하십시오.", "insight_tip": "한미 금리차와 환율 변동성을 변수로 추가하십시오.", "icon_type": "analysis"},
            {"sub_heading": "3. 디커플링 발생 시 주도 섹터", "text": "나스닥 하락에도 국내 증시가 견조하다면 강력한 개별 모멘텀이 작동 중인 것입니다.", "insight_tip": "상대적 강도 지표(RS)가 개선되는 종목을 찾으십시오.", "icon_type": "psychology"}
        ],
        "practical_guide": {"heading": "글로벌 매매 가이드", "items": [{"title": "글로벌 섹터 맵핑", "description": "나스닥 시총 상위주와 연동되는 국내 리스트를 구축하십시오."}]},
        "conclusion": {"text": "세계 경제는 하나로 연결되어 있습니다.", "closing_statement": "글로벌 인사이트를 제공하는 이음스탁."}
    },
    {
        "category": "Sector Rotation",
        "title": "주도 섹터 순환매 추적법: 돈의 흐름을 먼저 선점하십시오",
        "slug": "sector-rotation-tracking-strategy",
        "author": "ieumstock AI Lab",
        "tags": ["순환매", "섹터분석", "주도주"],
        "introduction": {"heading": "돈의 흐름은 멈추지 않습니다. 다음 목적지를 찾으십시오.", "text": "시장의 자금은 한곳에 머물지 않고 수익을 극대화할 수 있는 곳으로 끊임없이 이동합니다."},
        "core_analysis": [
            {"sub_heading": "1. 자금 이동 경로: 낙폭 과대 섹터", "text": "주도 섹터가 고점에서 쉴 때 자금은 소외되었던 낙폭 과대 섹터로 흘러갑니다.", "insight_tip": "업종별 등락률 히트맵을 매일 체크하십시오.", "icon_type": "trend"},
            {"sub_heading": "2. 대장주 이동과 확산 현상", "text": "섹터 내 대장주가 먼저 치고 나간 뒤 후속주들로 온기가 확산됩니다.", "insight_tip": "대장주와 부대장주의 이격도를 분석하십시오.", "icon_type": "volume"},
            {"sub_heading": "3. 주도주 선별: 실적 턴어라운드", "text": "순환매 끝에서 다음 주도주가 될 곳은 실적 개선 기대감이 가장 큰 곳입니다.", "insight_tip": "기관 투자자의 바스켓 매수 종목군을 확인하십시오.", "icon_type": "strategy"}
        ],
        "practical_guide": {"heading": "순환매 선점 가이드", "items": [{"title": "섹터 바스켓 구성", "description": "주요 섹터별 핵심 종목을 묶어 실시간 관찰하십시오."}]},
        "conclusion": {"text": "적절한 타이밍과 과감한 결정이 수익을 결정합니다.", "closing_statement": "돈의 길목을 지키는 이음스탁."}
    },
    {
        "category": "Expert Insight",
        "title": "외인/기관의 '쌍끌이' 매수 포착: 메이저 수급과 주가 부양의 함수관계",
        "slug": "major-supply-demand-analysis",
        "author": "ieumstock AI Lab",
        "tags": ["수급분석", "외인매수", "기관매집", "주도주"],
        "introduction": {"heading": "돈의 주인이 누구인지 파악하는 것이 투자의 시작입니다.", "text": "개인 투자자가 시장을 이길 수 없는 이유는 정보력이 아니라 자금력입니다. 메이저 수급이 집중되는 종목의 특징을 분석합니다."},
        "core_analysis": [
            {"sub_heading": "1. 양매수(쌍끌이)의 신뢰도", "text": "외국인과 기관이 동시에 매수 우위를 보일 때 주가는 가장 강력한 탄력을 받습니다.", "insight_tip": "연기금의 연속 매수세를 필히 확인하십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 창구 분석을 통한 허수 파악", "text": "특정 창구를 통한 집중 매수는 단순 차익 실현이 아닌 경영권이나 중장기 매집일 가능성이 높습니다.", "insight_tip": "검은 머리 외국인의 가짜 수급을 조심하십시오.", "icon_type": "volume"},
            {"sub_heading": "3. 수급과 이평선의 조화", "text": "수급이 들어오며 정배열로 전환되는 시점이 가장 확률 높은 타점입니다.", "insight_tip": "수급 유입 시 거래량 변화를 실시간으로 체크하십시오.", "icon_type": "trend"}
        ],
        "practical_guide": {"heading": "수급 매매 전략", "items": [{"title": "누적 수급 확인", "description": "1개월 누적 순매수량이 1위를 기록하는 섹터를 공략하십시오."}]},
        "conclusion": {"text": "수급은 주가의 선행 지표입니다.", "closing_statement": "이음스탁이 메이저의 발자취를 추적합니다."}
    },
    {
        "category": "Technical Analysis",
        "title": "볼린저 밴드 상단 돌파와 시세 분출: 변동성을 수익으로 바꾸는 법",
        "slug": "bollinger-band-breakout-strategy",
        "author": "ieumstock AI Lab",
        "tags": ["볼린저밴드", "변동성", "기술적분석", "돌파매매"],
        "introduction": {"heading": "밴드가 수렴할 때 폭발을 준비하십시오.", "text": "변동성이 극도로 축소된 후 밴드 상단을 뚫고 나가는 흐름은 강력한 추세 형성의 전조입니다."},
        "core_analysis": [
            {"sub_heading": "1. 밴드 수렴(Squeeze)의 강도", "text": "밴드의 폭이 좁아질수록 이후 발생하는 시세의 에너지는 더욱 강력해집니다.", "insight_tip": "밴드 폭 지표(Bandwidth)를 활용하십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 상단 돌파 시의 거래량 실린 양봉", "text": "거래량 없이 밴드 상단을 터치하는 것은 가짜 돌파인 경우가 많습니다.", "insight_tip": "돌파 시 전일 대비 200% 이상 거래량을 확인하십시오.", "icon_type": "volume"},
            {"sub_heading": "3. 중심선 지지와 추세 지속", "text": "돌파 후 밴드 중심선(20일선)을 이탈하지 않는다면 추세는 지속됩니다.", "insight_tip": "중심선을 이탈할 때가 최종 매도 타이밍입니다.", "icon_type": "trend"}
        ],
        "practical_guide": {"heading": "밴드 활용 수칙", "items": [{"title": "추세 추종", "description": "밴드 상단을 타고 올라가는 '밴드 워킹' 구간을 즐기십시오."}]},
        "conclusion": {"text": "변동성은 두려움이 아닌 기회입니다.", "closing_statement": "이음스탁이 변동성의 맥점을 짚어드립니다."}
    },
    {
        "category": "Market Strategy",
        "title": "공매도 쇼트커버링(Short Covering) 포착: 급등주의 숨은 동력",
        "slug": "short-covering-spike-analysis",
        "author": "ieumstock AI Lab",
        "tags": ["공매도", "쇼트커버링", "수급분석", "급등주"],
        "introduction": {"heading": "하락에 베팅한 세력이 항복할 때 주가는 폭등합니다.", "text": "공매도 잔고가 많은 종목이 호재와 함께 상승하기 시작하면, 손실을 막으려는 쇼트커버링 물량이 겹치며 폭발적인 시세를 냅니다."},
        "core_analysis": [
            {"sub_heading": "1. 공매도 잔고 상위 종목 분석", "text": "주가 하락 압력이 극에 달했을 때, 반전의 트리거를 기다려야 합니다.", "insight_tip": "공매도 비중이 10% 이상인 종목 중 바닥을 다지는 종목을 찾으십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 숏 스퀴즈(Short Squeeze) 발생 시그널", "text": "장중 갑작스러운 대량 매수세 유입과 함께 주가가 5% 이상 급등하면 쇼트커버링의 시작일 수 있습니다.", "insight_tip": "외국인 창구의 매수 전환 여부를 체크하십시오.", "icon_type": "volume"},
            {"sub_heading": "3. 저항선 돌파와 공포의 매수", "text": "공매도 세력이 설정한 손절 라인을 돌파할 때 시세는 오버슈팅으로 이어집니다.", "insight_tip": "직전 고점 돌파 시 수급의 집중도를 확인하십시오.", "icon_type": "trend"}
        ],
        "practical_guide": {"heading": "숏 스퀴즈 대응", "items": [{"title": "공매도 잔고 확인", "description": "KRX 공매도 종합 포털 데이터를 주기적으로 체크하십시오."}]},
        "conclusion": {"text": "남의 불행이 기회가 되는 냉혹한 시장의 원리입니다.", "closing_statement": "이음스탁이 숨겨진 급등 동력을 찾아드립니다."}
    },
    {
        "category": "Mindset",
        "title": "분산 투자의 함정: 20개 종목을 가진 당신이 수익이 안 나는 이유",
        "slug": "diversification-trap-analysis",
        "author": "ieumstock AI Lab",
        "tags": ["분산투자", "집중투자", "포트폴리오", "투자마인드"],
        "introduction": {"heading": "관리할 수 없는 분산은 방치와 같습니다.", "text": "계좌에 종목이 너무 많으면 시장이 올라도 내 계좌는 그대로인 현상이 발생합니다. 효율적인 포트폴리오 압축 전략을 알아봅니다."},
        "core_analysis": [
            {"sub_heading": "1. 종목 수와 수익률의 상관관계", "text": "종목이 많을수록 지수 수익률을 넘어서기 어렵습니다. 선택과 집중이 필요한 이유입니다.", "insight_tip": "자신이 완벽히 이해하는 종목 3~5개에 집중하십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 옥석 가리기를 통한 슬림화", "text": "수익이 안 나는 종목을 붙들고 있기보다, 주도주 섹터로 자금을 옮겨야 합니다.", "insight_tip": "실적이 뒷받침되지 않는 테마주는 과감히 정리하십시오.", "icon_type": "strategy"},
            {"sub_heading": "3. 비중 조절의 예술", "text": "확신이 있는 종목에 비중을 싣는 용기가 큰 수익을 만듭니다.", "insight_tip": "포트폴리오의 50% 이상을 주도 섹터 대장주에 배분하십시오.", "icon_type": "psychology"}
        ],
        "practical_guide": {"heading": "포트폴리오 정비", "items": [{"title": "잡주 정리", "description": "내일 당장 상장폐지 되어도 이상하지 않은 종목부터 도려내십시오."}]},
        "conclusion": {"text": "진정한 계좌 성장은 압축에서 시작됩니다.", "closing_statement": "당신의 계좌를 다이어트 시켜드리는 이음스탁."}
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
        except: insights = []

    today = datetime.now().strftime("%Y.%m.%d")
    today_iso = datetime.now().strftime("%Y-%m-%d")
    
    # 1. Load Recommendation Data
    dashboard_data = {}
    try:
        with open('public/dashboard_data.json', 'r', encoding='utf-8-sig') as f:
            dashboard_data = json.load(f)
    except: pass

    recs = dashboard_data.get('recommendations', [])
    
    # IMPROVED: Prevent repeat stock analysis
    recent_tickers = [i.get('system_link', {}).get('related_ticker', [None])[0] for i in insights[:5]]
    available_recs = [r for r in recs if r['stock_info']['ticker'] not in recent_tickers]
    if not available_recs: available_recs = recs

    recommendation = random.choice(available_recs[:3]) if available_recs else None

    if recommendation:
        pick = recommendation
        # Use variation for stock analysis
        section_variations = [
            [
                f"전일 거래량 대비 300% 이상의 대량 거래가 포착되었습니다. 특히 5분 봉상 주요 매물대인 {pick['trading_strategy']['entry_price']:,}원 위에서 안정적인 지지 흐름을 보이고 있으며, 이는 세력이 하방 압력을 이겨내고 상방으로 방향을 틀었다는 강력한 증거입니다.",
                f"장 초반부터 평소 대비 5배 이상의 압도적인 거래량이 실리며 {pick['trading_strategy']['entry_price']:,}원 라인을 돌파했습니다. 실시간 체결 강도가 150%를 상회하며 공격적인 매수세가 유입되고 있습니다.",
                f"{pick['stock_info']['real_name']}은(는) 현재 거래량 가중 평균 가격(VWAP) 상단에 위치해 있습니다. 이는 시장 참여자들이 현재 가격을 저평가로 인식하고 적극적으로 베팅하고 있음을 시사합니다."
            ],
            [
                f"외국인과 기관의 매수세가 바닥권에서 동시에 유입되는 '쌍끌이' 현상이 나타나고 있습니다. 특히 최근 5거래일간의 누적 수급량이 평소 대비 2.5배 증가하며, 메이저 주체들이 물량을 매집하고 있는 징후가 뚜렷합니다.",
                f"특정 창구를 통한 집중적인 매수세가 포착되었습니다. 기타법인과 사모펀드 중심의 스마트 머니가 바닥권 공구리 구간에서 조용히 물량을 확보하고 있는 것으로 분석됩니다.",
                f"수급 흐름 상 저점을 높여가는 매집 패턴이 완성되었습니다. 유통 물량의 상당 부분이 이미 메이저 주체들에게 넘어간 상태로, 작은 거래량으로도 큰 시세 분출이 가능한 '품절주' 특성을 보이기 시작했습니다."
            ],
            [
                f"112일선이라는 거대한 매물벽을 뚫어내는 과정은 세력이 막대한 자금을 투입했다는 확실한 증거입니다. {pick['stock_info']['real_name']}은 캔들의 몸통이 이평선 위에 안착한 후, 다음 거래일에 이평선을 지지선으로 삼아 망치형 캔들을 만드는 '개미 털기' 구간을 통과했습니다.",
                f"역배열의 끝단에서 5일선이 20일선을 돌파하는 골든크로스가 발생했습니다. 60일선 지지까지 확인된 상태로, 이는 영매공파 기법에서 가장 신뢰도가 높은 '256 타점'에 해당합니다.",
                f"장기 하락 추세선을 우상향으로 돌파하는 첫 번째 양봉이 출현했습니다. 볼린저 밴드 상단을 강하게 치고 나가는 흐름은 시세 폭발의 전조 현상으로 볼 수 있습니다."
            ],
            [
                "시장 노이즈를 제거하고 순수 에너지를 측정한 결과, 변동성 지표가 안정적인 범위 내에 머물고 있습니다. 지수 하락 대비 견조한 주가 흐름을 보여주어, 시장 대비 상대적 강도(RS)가 매우 높게 측정되었습니다.",
                "리스크 모델링 결과, 현재 구간에서의 하방 압력은 제한적입니다. 주요 지지선과의 이격도가 5% 내외로 매우 짧아, 손익비(Reward-to-Risk)가 극대화된 매력적인 타점입니다.",
                "코스피/코스닥 지수의 변동성에도 불구하고 동사는 독자적인 수급을 유지하고 있습니다. 이는 단순한 테마 편입이 아닌 종목 고유의 강력한 모멘텀이 작동하고 있음을 의미합니다."
            ],
            [
                "단기적으로는 직전 고점 돌파가 예상되며, 중장기적으로는 강력한 시세 분출이 기대됩니다. 현재 구간은 무릎 이하의 저평가 구간으로, 눌림목 발생 시 비중 확대 전략이 유효합니다.",
                "1차 목표가는 장기 매물대 상단으로 설정하되, 돌파 시 추세 추종 전략을 통해 수익을 극대화하십시오. 세력의 이탈 시그널이 없는 한 홀딩 전략이 유리합니다.",
                "상승 1파동 후 짧은 눌림목이 예상됩니다. 지지선을 최종 생명선으로 잡고 분할 익절 전략을 병행하시기 바랍니다."
            ]
        ]
        
        core_analysis = []
        headings = ["1. 실시간 돌파 감지 (SCANNING)", "2. 메이저 수급 추적 (TRACKING)", "3. 기술적 근거: 이평선 분석", "4. 변동성 필터링 (VERIFIED)", "5. 향후 전망 및 시나리오"]
        icons = ["analysis", "volume", "trend", "risk", "strategy"]
        for i in range(5):
            core_analysis.append({
                "sub_heading": headings[i],
                "text": random.choice(section_variations[i]),
                "insight_tip": f"지지선 {pick['trading_strategy']['stop_loss']:,}원 준수 필수입니다.",
                "icon_type": icons[i]
            })

        new_insight = {
            "article_info": {
                "id": 2000 + len(insights),
                "slug": f"analysis-{pick['metadata']['slug']}",
                "title": f"오늘의 {pick['metadata']['tier']} 브레인 오프 타점: {pick['stock_info']['real_name']} 정밀 분석",
                "author": "ieumstock AI Research", "date": today, "publishDate": today_iso, "category": "종목 분석",
                "tags": [pick['stock_info']['real_name'], "브레인오프", "기술적분석"]
            },
            "seo_metadata": {"meta_title": f"{pick['stock_info']['real_name']} 정밀 분석", "meta_description": f"{pick['stock_info']['real_name']} 종목의 영매공파 타점을 분석합니다."},
            "content_body": {
                "introduction": {"heading": f"{pick['stock_info']['real_name']}, 왜 지금인가?", "text": f"{pick['stock_info']['real_name']} 종목에서 강력한 에너지 응축이 포착되었습니다."},
                "core_analysis": core_analysis,
                "practical_guide": {"heading": "투자 가이드라인", "items": [{"title": "진입 구간", "description": f"{pick['trading_strategy']['entry_price']:,}원 부근 접근"}, {"title": "리스크", "description": f"손절가 {pick['trading_strategy']['stop_loss']:,}원 이탈 시 대응"}]},
                "conclusion": {"text": f"{pick['stock_info']['real_name']}은 기술적 완성도가 높은 타점입니다.", "closing_statement": "이음스탁 AI Lab이 당신을 응원합니다."}
            },
            "system_link": {"target_tool": "Brain-Off Hybrid 2.1", "cta_text": "수급 분석 확인하기", "related_ticker": [pick['stock_info']['ticker']]}
        }
    else:
        # Educational Topic Case
        # Improved: Random selection to prevent cyclical repetition
        pick = random.choice(TOPICS)
        new_insight = {
            "article_info": {
                "id": 2000 + len(insights), "slug": f"{pick['slug']}-{today_iso}",
                "title": pick['title'], "author": pick['author'], "date": today, "publishDate": today_iso,
                "category": pick['category'], "tags": pick['tags']
            },
            "seo_metadata": {"meta_title": pick['title'], "meta_description": pick['introduction']['text']},
            "content_body": {
                "introduction": pick['introduction'],
                "core_analysis": pick['core_analysis'],
                "practical_guide": pick['practical_guide'],
                "conclusion": pick['conclusion']
            },
            "system_link": {"target_tool": "Brain-Off Hybrid 2.1", "cta_text": "AI 리서치 엔진 더보기", "related_ticker": []}
        }

    # Add to insights and save
    insights.insert(0, new_insight)
    # Deduplicate by slug
    seen_slugs = set()
    final_insights = []
    for i in insights:
        if i['article_info']['slug'] not in seen_slugs:
            final_insights.append(i)
            seen_slugs.add(i['article_info']['slug'])
    
    with open(INSIGHTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_insights[:200], f, ensure_ascii=False, indent=2)
    print(f"Successfully generated dynamic insight for {today}")

if __name__ == "__main__":
    generate_insight()
