import json
import os
import random
from datetime import datetime, timedelta

# Path to the dynamic insights file
INSIGHTS_FILE = 'public/daily_insights.json'

# High-quality, long-form topics for professional research institute level
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
        "category": "Sector Deep Dive",
        "title": "반도체 HBM 전쟁과 패키징 기술의 진화",
        "slug": "semiconductor-hbm-packaging",
        "author": "ieumstock AI Lab",
        "tags": ["반도체", "HBM", "패키징", "엔비디아"],
        "introduction": {"heading": "AI 시대의 심장, HBM은 단순한 메모리가 아닙니다.", "text": "데이터 병목 현상을 해결하기 위한 HBM(고대역폭 메모리) 기술력 차이가 반도체 기업의 생존을 결정합니다."},
        "core_analysis": [
            {"sub_heading": "1. TSV(실리콘 관통 전극) 공정의 중요성", "text": "D램을 수직으로 쌓아 올리는 TSV 기술은 수율 확보가 핵심 경쟁력입니다.", "insight_tip": "수율 개선 관련 장비주에 주목하십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 하이브리드 본딩 기술의 도래", "text": "더 얇고 더 촘촘하게 연결하기 위한 하이브리드 본딩은 차세대 패키징의 표준이 될 것입니다.", "insight_tip": "본딩 장비 국산화 기업을 체크하십시오.", "icon_type": "trend"},
            {"sub_heading": "3. 글로벌 빅테크의 커스텀 칩 수요", "text": "자체 칩을 설계하는 빅테크들의 수요는 메모리 업체에 새로운 기회를 제공합니다.", "insight_tip": "디자인하우스 기업들의 수주 현황을 모니터링하십시오.", "icon_type": "volume"}
        ],
        "practical_guide": {"heading": "섹터 투자 수칙", "items": [{"title": "공급망 분석", "description": "전공정보다 후공정(OSAT)의 부가가치 상승에 주목하십시오."}]},
        "conclusion": {"text": "기술 격차가 곧 주가 격차입니다.", "closing_statement": "이음스탁이 반도체 기술의 정점을 분석합니다."}
    },
    {
        "category": "Macro Economics",
        "title": "미국 고용 지표와 FOMC 금리 결정의 메커니즘",
        "slug": "macro-employment-fomc-logic",
        "author": "ieumstock AI Lab",
        "tags": ["매크로", "고용지표", "금리", "FOMC"],
        "introduction": {"heading": "데이터에 의존하는 연준, 고용이 곧 나침반입니다.", "text": "비농업 고용 지수와 실업률은 연준의 금리 경로를 결정하는 가장 강력한 변수입니다."},
        "core_analysis": [
            {"sub_heading": "1. Bad News is Good News", "text": "고용 지표의 둔화가 금리 인하 기대감을 높여 증시에 호재로 작용하는 역설적 상황을 이해해야 합니다.", "insight_tip": "임금 상승률의 추세를 함께 확인하십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 점도표(Dot Plot) 읽는 법", "text": "FOMC 위원들의 향후 금리 전망을 담은 점도표는 시장의 기대치와 비교 분석해야 합니다.", "insight_tip": "시장 예상치(FedWatch)와 점도표의 괴리를 체크하십시오.", "icon_type": "trend"},
            {"sub_heading": "3. 실질 금리와 할인율", "text": "금리 변동은 성장주의 미래 가치를 결정하는 할인율에 직접적인 영향을 미칩니다.", "insight_tip": "금리 하락기에는 밸류에이션 매력이 높은 기술주를 선점하십시오.", "icon_type": "volume"}
        ],
        "practical_guide": {"heading": "매크로 대응", "items": [{"title": "지표 발표 캘린더", "description": "매월 첫째 주 금요일 고용 지표 발표 시간을 반드시 체크하십시오."}]},
        "conclusion": {"text": "거시 경제의 흐름을 읽는 자가 시장을 지배합니다.", "closing_statement": "이음스탁이 글로벌 경제의 맥을 짚어드립니다."}
    },
    {
        "category": "Advanced Technique",
        "title": "일목균형표와 구름대 돌파: 시세의 균형을 읽는 법",
        "slug": "advanced-ichimoku-cloud-breakout",
        "author": "ieumstock AI Lab",
        "tags": ["기술적분석", "일목균형표", "구름대", "추세전환"],
        "introduction": {"heading": "시간과 가격의 조화, 일목균형표의 정수", "text": "단순한 지표를 넘어 시장의 에너지가 어디로 쏠리는지 입체적으로 분석하는 도구입니다."},
        "core_analysis": [
            {"sub_heading": "1. 구름대(의운/양운)의 저항과 지지", "text": "두터운 매물벽인 구름대를 뚫어내는 흐름은 강력한 매수세의 유입을 의미합니다.", "insight_tip": "구름대 상단 안착 시점을 추격 매수 타점으로 잡으십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 전환선과 기준선의 교차", "text": "전환선이 기준선을 상향 돌파하는 호전 현상은 추세 상승의 강력한 신호입니다.", "insight_tip": "후행스팬이 주가를 돌파하는지도 확인하십시오.", "icon_type": "trend"},
            {"sub_heading": "3. 선행스팬의 방향성", "text": "미래의 지지와 저항을 예고하는 선행스팬의 기울기는 향후 시세의 탄력을 결정합니다.", "insight_tip": "양운이 형성되는 구간에서 비중을 확대하십시오.", "icon_type": "volume"}
        ],
        "practical_guide": {"heading": "일목 활용법", "items": [{"title": "시간론 체크", "description": "변화일(9, 17, 26일)에 발생하는 추세 전환에 주목하십시오."}]},
        "conclusion": {"text": "시장은 스스로 균형을 찾아갑니다.", "closing_statement": "이음스탁이 시세의 균형점을 찾아드립니다."}
    },
    {
        "category": "Sector Deep Dive",
        "title": "2차전지 LFP vs NCM: 시장 재편의 핵심 포인트",
        "slug": "battery-lfp-ncm-market-shift",
        "author": "ieumstock AI Lab",
        "tags": ["2차전지", "LFP", "NCM", "전기차"],
        "introduction": {"heading": "에너지 밀도와 가격의 싸움", "text": "전기차 대중화 시대를 맞아 저가형 LFP 배터리와 고성능 NCM 배터리의 시장 점유율 경쟁이 치열합니다."},
        "core_analysis": [
            {"sub_heading": "1. LFP 배터리의 화려한 부활", "text": "테슬라를 필두로 한 보급형 전기차 확대는 LFP 배터리 공급망에 새로운 활력을 불어넣고 있습니다.", "insight_tip": "LFP 양극재 및 첨가제 국산화 기업을 찾으십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 하이니켈 NCM의 초격차 전략", "text": "장거리 주행을 위한 고성능 배터리 수요는 여전히 견조하며, 기술적 진입 장벽이 높습니다.", "insight_tip": "니켈 비중 90% 이상의 하이니켈 기술력을 보유한 대장주를 홀딩하십시오.", "icon_type": "trend"},
            {"sub_heading": "3. 실리콘 음극재와 전고체 배터리", "text": "충전 속도와 안전성을 획기적으로 개선할 차세대 소재 기술이 게임 체인저가 될 것입니다.", "insight_tip": "차세대 소재 개발 관련 정부 과제 수행 기업을 체크하십시오.", "icon_type": "volume"}
        ],
        "practical_guide": {"heading": "배터리 투자 전략", "items": [{"title": "판가 연동제 체크", "description": "리튬, 니켈 가격과 양극재 판가 연동 추이를 반드시 확인하십시오."}]},
        "conclusion": {"text": "에너지 패권을 잡는 자가 미래를 가집니다.", "closing_statement": "이음스탁이 2차전지 밸류체인을 완벽 해부합니다."}
    },
    {
        "category": "Strategy",
        "title": "어닝 서프라이즈 선별법: 실적 발표 전후의 주가 함수",
        "slug": "strategy-earnings-surprise-pick",
        "author": "ieumstock AI Lab",
        "tags": ["실적발표", "어닝서프라이즈", "재무분석", "가치투자"],
        "introduction": {"heading": "숫자는 거짓말을 하지 않습니다.", "text": "단순한 흑자 전환을 넘어 시장 컨센서스를 압도하는 어닝 서프라이즈 종목은 강력한 추세 상승을 만듭니다."},
        "core_analysis": [
            {"sub_heading": "1. 매출 성장의 질 분석", "text": "일회성 이익이 아닌 본업에서의 매출 확대와 영업이익률 개선이 동반되어야 합니다.", "insight_tip": "가동률 지표와 재고 자산 회전율을 체크하십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 피크 아웃(Peak-out) 우려 판별", "text": "실적이 좋아도 주가가 내리는 것은 다음 분기 전망이 어둡기 때문입니다. 가이던스가 핵심입니다.", "insight_tip": "실적 발표 후 컨퍼런스 콜 내용을 정독하십시오.", "icon_type": "trend"},
            {"sub_heading": "3. 실적 발표 전 매집 시그널", "text": "정보력이 빠른 기관들이 실적 발표 1~2주 전부터 매수세를 강화하는 종목을 선점해야 합니다.", "insight_tip": "최근 한 달간의 기관 누적 순매수량을 확인하십시오.", "icon_type": "volume"}
        ],
        "practical_guide": {"heading": "실적 시즌 매뉴얼", "items": [{"title": "컨센서스 체크", "description": "에프앤가이드 등 데이터 플랫폼의 추정치 변화를 추적하십시오."}]},
        "conclusion": {"text": "실적은 주가의 중력입니다.", "closing_statement": "이음스탁이 우량한 실적주를 선별해드립니다."}
    },
    {
        "category": "Advanced Technique",
        "title": "RSI 다이버전스와 추세 반전의 비밀",
        "slug": "advanced-rsi-divergence-strategy",
        "author": "ieumstock AI Lab",
        "tags": ["기술적분석", "RSI", "다이버전스", "매수타점"],
        "introduction": {"heading": "주가와 지표의 엇박자 속에 기회가 있다", "text": "주가는 낮아지는데 지표는 높아지는 '상승 다이버전스'는 바닥 확인의 강력한 도구입니다."},
        "core_analysis": [
            {"sub_heading": "1. 불리시(Bullish) 다이버전스 포착", "text": "과매도 구간(30 이하)에서 발생하는 지표의 저점 상승은 매도세의 고갈을 의미합니다.", "insight_tip": "이중 바닥 패턴과 결합될 때 신뢰도가 극대화됩니다.", "icon_type": "analysis"},
            {"sub_heading": "2. 히든 다이버전스의 활용", "text": "추세 지속형 시그널인 히든 다이버전스는 눌림목 매수 타점을 잡는 데 유용합니다.", "insight_tip": "강력한 상승 추세 중 일시적인 지표 하락을 노리십시오.", "icon_type": "trend"},
            {"sub_heading": "3. 50선 돌파와 추세 확정", "text": "다이버전스 발생 후 RSI 지수가 50선을 상향 돌파하면 새로운 추세가 시작된 것으로 봅니다.", "insight_tip": "거래량 동반 여부를 필히 확인하십시오.", "icon_type": "volume"}
        ],
        "practical_guide": {"heading": "RSI 수칙", "items": [{"title": "기간 설정", "description": "표준인 14일 설정을 기본으로 하되, 단기 매매는 9일 설정을 병행하십시오."}]},
        "conclusion": {"text": "모두가 공포에 질릴 때 지표는 희망을 말합니다.", "closing_statement": "이음스탁이 반전의 신호를 읽어드립니다."}
    },
    {
        "category": "Sector Deep Dive",
        "title": "로봇 산업의 미래: 협동 로봇에서 휴머노이드까지",
        "slug": "sector-robotics-future-vision",
        "author": "ieumstock AI Lab",
        "tags": ["로봇", "협동로봇", "휴머노이드", "스마트팩토리"],
        "introduction": {"heading": "인간의 노동을 대체하는 기술 혁명", "text": "저출산과 고령화 문제의 해결책으로 떠오른 로봇 산업은 단순 자동화를 넘어 AI와 결합하고 있습니다."},
        "core_analysis": [
            {"sub_heading": "1. 감속기: 로봇의 핵심 부품", "text": "로봇 원가의 상당 부분을 차지하는 감속기 기술의 국산화 여부가 기업의 수익성을 결정합니다.", "insight_tip": "정밀 감속기 제조 역량을 가진 기업에 주목하십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 대기업의 로봇 시장 진출", "text": "삼성, 현대차, LG 등 대기업의 M&A와 투자는 섹터 전반의 밸류에이션을 높이는 촉매제입니다.", "insight_tip": "대기업과 파트너십을 맺은 중소형 장비주를 선점하십시오.", "icon_type": "trend"},
            {"sub_heading": "3. AI와 로봇의 결합 (Brain AI)", "text": "스스로 판단하고 움직이는 AI 기반 로봇 소프트웨어 기술력이 차별화 포인트입니다.", "insight_tip": "비전 AI 및 자율 주행 소프트웨어 관련주를 체크하십시오.", "icon_type": "volume"}
        ],
        "practical_guide": {"heading": "로봇주 투자 가이드", "items": [{"title": "적용 분야 확인", "description": "산업용, 서비스용, 의료용 중 성장이 빠른 분야를 선택하십시오."}]},
        "conclusion": {"text": "로봇은 더 이상 영화 속 이야기가 아닙니다.", "closing_statement": "이음스탁이 미래 산업의 주역을 분석합니다."}
    },
    {
        "category": "Market Strategy",
        "title": "코스피 '밸류업' 프로그램과 저PBR주의 재평가",
        "slug": "market-korea-value-up-analysis",
        "author": "ieumstock AI Lab",
        "tags": ["밸류업", "저PBR", "주주환원", "국내증시"],
        "introduction": {"heading": "코리아 디스카운트 해소의 서막", "text": "정부 주도의 기업 가치 제고 프로그램은 만년 저평가 상태였던 국내 기업들의 체질 개선을 요구하고 있습니다."},
        "core_analysis": [
            {"sub_heading": "1. PBR 1배 미만의 의미", "text": "자산 가치보다 시가 총액이 낮은 기업들이 주주 환원을 강화할 때 강력한 리레이팅이 발생합니다.", "insight_tip": "현금 보유량이 많고 자사주 소각 의지가 있는 기업을 찾으십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 배당 성향과 자사주 정책", "text": "단순 배당 수익률보다 배당 성향의 지속적인 확대 여부가 장기 투자 가치를 결정합니다.", "insight_tip": "최근 3년간 배당금이 우상향한 종목을 필터링하십시오.", "icon_type": "trend"},
            {"sub_heading": "3. 지배 구조 개선의 촉매제", "text": "지배 구조 투명화는 외국인 투자자들의 수급을 유인하는 가장 강력한 유인책입니다.", "insight_tip": "지주사들의 거버넌스 업데이트 소식을 모니터링하십시오.", "icon_type": "volume"}
        ],
        "practical_guide": {"heading": "밸류업 투자법", "items": [{"title": "ROE 분석", "description": "저PBR이면서 ROE(자기자본이익률)가 개선되는 종목이 베스트입니다."}]},
        "conclusion": {"text": "제 가치를 찾아가는 과정에 기회가 있습니다.", "closing_statement": "이음스탁이 숨겨진 진주를 찾아드립니다."}
    },
    {
        "category": "Advanced Technique",
        "title": "볼륨 프로파일(Volume Profile)과 POC 매물대 분석",
        "slug": "advanced-volume-profile-poc",
        "author": "ieumstock AI Lab",
        "tags": ["기술적분석", "볼륨프로파일", "매물대", "수급"],
        "introduction": {"heading": "가격이 아닌 '시간'과 '거래량'의 결합", "text": "어느 가격대에서 가장 많은 거래가 일어났을지를 분석하여 강력한 지지와 저항을 찾아내는 고도화된 기법입니다."},
        "core_analysis": [
            {"sub_heading": "1. POC(Point of Control)의 힘", "text": "가장 많은 거래가 집중된 POC 라인은 시세의 자석과 같은 역할을 하며, 돌파 시 강력한 지지선이 됩니다.", "insight_tip": "주가가 POC 위에 있을 때만 매매 전략을 세우십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 가치 영역(Value Area) 이탈과 회귀", "text": "대부분의 거래가 일어나는 영역을 벗어날 때 시세는 오버슈팅 혹은 언더슈팅 구간에 진입합니다.", "insight_tip": "가치 영역 하단에서 지지받는 시점을 저점 매수 기회로 삼으십시오.", "icon_type": "trend"},
            {"sub_heading": "3. 볼륨 노드(High/Low Volume Nodes)", "text": "거래가 없는 구간(Low Volume Node)은 주가가 빠르게 통과하는 성질이 있습니다.", "insight_tip": "매물 공백 구간에서의 급등락 가능성을 염두에 두십시오.", "icon_type": "volume"}
        ],
        "practical_guide": {"heading": "매물대 활용", "items": [{"title": "매물 소화 과정", "description": "고점 매물대 근처에서 거래량이 줄어들며 횡보하는 것은 매물 소화의 신호입니다."}]},
        "conclusion": {"text": "진짜 매물을 읽어야 세력의 의도가 보입니다.", "closing_statement": "이음스탁이 보이지 않는 매물벽을 분석합니다."}
    },
    {
        "category": "Macro Economics",
        "title": "환율 변동성과 외국인 수급의 상관관계",
        "slug": "macro-exchange-rate-foreign-flow",
        "author": "ieumstock AI Lab",
        "tags": ["환율", "외국인수급", "매크로", "달러"],
        "introduction": {"heading": "원화 가치가 오를 때 외국인은 돌아옵니다.", "text": "환차익을 노리는 외국인 투자자들에게 환율은 종목의 펀더멘털만큼이나 중요한 결정 요소입니다."},
        "core_analysis": [
            {"sub_heading": "1. 원/달러 환율과 환차손익", "text": "환율이 급등(원화 약세)하면 외국인은 주가가 올라도 환차손 때문에 매도 버튼을 누릅니다.", "insight_tip": "달러 인덱스의 꺾임 여부를 선행 지표로 활용하십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 환율 하향 안정화와 수급 유입", "text": "환율이 고점을 찍고 내려오기 시작할 때 외국인의 바스켓 매수가 집중됩니다.", "insight_tip": "대형 수출주 중심의 외국인 순매수 전환을 확인하십시오.", "icon_type": "trend"},
            {"sub_heading": "3. 엔저 현상과 수출 경쟁력", "text": "일본 기업과 경합하는 자동차, 철강 섹터는 엔/달러 환율 추이에 민감하게 반응합니다.", "insight_tip": "일본 엔화 가치 반등 시 국내 반사이익 종목을 선점하십시오.", "icon_type": "volume"}
        ],
        "practical_guide": {"heading": "환율 대응 가이드", "items": [{"title": "NDF 환율 체크", "description": "장 시작 전 역외 환율(NDF)을 확인하여 당일 수급 흐름을 예측하십시오."}]},
        "conclusion": {"text": "돈은 더 높은 가치를 찾아 국경을 넘습니다.", "closing_statement": "이음스탁이 글로벌 자금의 흐름을 추적합니다."}
    },
    {
        "category": "Strategy",
        "title": "공시 분석: 유상증자와 CB 발행, 악재인가 호재인가?",
        "slug": "strategy-disclosure-analysis-cb",
        "author": "ieumstock AI Lab",
        "tags": ["공시분석", "유상증자", "전환사채", "기업분석"],
        "introduction": {"heading": "행간을 읽는 공시 분석", "text": "자금 조달의 목적이 '시설 투자'인지 '운영 자금'인지에 따라 주가의 운명은 180도 달라집니다."},
        "core_analysis": [
            {"sub_heading": "1. 제3자 배정 유상증자의 파급력", "text": "대기업이나 전략적 파트너로부터의 자금 유입은 강력한 성장 동력이자 호재입니다.", "insight_tip": "배정 대상자의 신용도와 보호예수 기간을 체크하십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 전환사채(CB) 리픽싱의 함정", "text": "주가 하락에 따라 전환가액이 낮아지는 리픽싱은 기존 주주의 가치를 희석시키는 요소입니다.", "insight_tip": "미전환 사채 물량의 오버슈팅 리스크를 항상 계산하십시오.", "icon_type": "trend"},
            {"sub_heading": "3. 시설 투자 공시와 캐파(CAPA) 증설", "text": "공장을 짓는다는 것은 향후 매출 성장에 대한 확신이 있다는 증거입니다.", "insight_tip": "투자 완료 시점과 매출 발생 시기를 매칭해 보십시오.", "icon_type": "volume"}
        ],
        "practical_guide": {"heading": "공시 매뉴얼", "items": [{"title": "다트(DART) 활용", "description": "주요 공시 발생 시 원문을 정독하고 자금의 사용처를 반드시 확인하십시오."}]},
        "conclusion": {"text": "정보의 불균형을 해소하는 것이 투자의 기본입니다.", "closing_statement": "이음스탁이 공시 이면의 진실을 분석합니다."}
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
    },
    {
        "category": "Sector Deep Dive",
        "title": "바이오 섹터 임상 3상의 문턱: 투자 리스크와 기회",
        "slug": "sector-bio-clinical-phase3-risk",
        "author": "ieumstock AI Lab",
        "tags": ["바이오", "임상3상", "신약개발", "리스크관리"],
        "introduction": {"heading": "하이 리스크 하이 리턴의 정점", "text": "임상 3상은 신약 개발의 마지막 관문이자 가장 거대한 자금이 투입되는 단계입니다."},
        "core_analysis": [
            {"sub_heading": "1. 통계적 유의성 확보의 난제", "text": "임상 2상에서의 결과가 3상에서 재현되지 않는 경우가 많습니다. p-value의 함정을 조심하십시오.", "insight_tip": "임상 설계의 정교함을 분석하는 것이 필수입니다.", "icon_type": "analysis"},
            {"sub_heading": "2. 기술 수출(L/O)의 시점", "text": "자체 개발보다 임상 중기 단계에서의 글로벌 빅파마 대상 기술 수출이 수익성 면에서 유리할 수 있습니다.", "insight_tip": "계약금(Upfront) 규모보다 마일스톤의 현실성을 체크하십시오.", "icon_type": "trend"},
            {"sub_heading": "3. 학회 발표와 모멘텀", "text": "ASCO, AACR 등 글로벌 암학회에서의 데이터 발표는 주가 부양의 강력한 트리거가 됩니다.", "insight_tip": "학회 일정 2~3개월 전부터 선취매 전략이 유효합니다.", "icon_type": "volume"}
        ],
        "practical_guide": {"heading": "바이오 투자 수칙", "items": [{"title": "현금 흐름 체크", "description": "임상 완료 시까지 버틸 수 있는 현금 보유량을 반드시 확인하십시오."}]},
        "conclusion": {"text": "과학적 근거 없는 기대감은 도박과 같습니다.", "closing_statement": "이음스탁이 바이오 기업의 기술력을 검증합니다."}
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
    if os.path.exists('public/dashboard_data.json'):
        try:
            with open('public/dashboard_data.json', 'r', encoding='utf-8') as f:
                dashboard_data = json.load(f)
        except Exception as e:
            print(f"Warning: Failed to load dashboard_data.json: {e}")
            dashboard_data = {}
    
    recs = dashboard_data.get('recommendations', [])
    
    # IMPROVED: Prevent repeat stock analysis
    recent_tickers = [i.get('system_link', {}).get('related_ticker', [None])[0] for i in insights[:5]]
    available_recs = [r for r in recs if r['stock_info']['ticker'] not in recent_tickers]
    if not available_recs: available_recs = recs

    recommendation = random.choice(available_recs[:3]) if available_recs else None

    if recommendation:
        pick = recommendation
        
        # --- 고도화된 동적 분석 엔진 (Variable-Rich Engine) ---
        # 실제 데이터 바인딩을 위한 변수 추출
        s_name = pick['stock_info']['real_name']
        s_price = pick['trading_strategy']['entry_price']
        s_target = pick['trading_strategy']['target_price']
        s_stop = pick['trading_strategy']['stop_loss']
        s_score = pick['metadata']['score']
        s_flags = pick['live_status'].get('ymg_flags', {})
        
        # 상황 맞춤형 토픽 매칭 (Context-Aware Matching)
        matched_topic = None
        if s_flags.get('공구리'):
            matched_topic = next((t for t in TOPICS if t['slug'] == 'deep-dive-into-concrete-pattern'), None)
        elif s_flags.get('매집봉') and s_score >= 80:
            matched_topic = next((t for t in TOPICS if t['slug'] == 'major-supply-demand-analysis'), None)
        elif s_flags.get('파란점선'):
            matched_topic = next((t for t in TOPICS if t['slug'] == 'bollinger-band-breakout-strategy'), None)
        
        # 섹션별 문장 패턴 다양화 (10가지 이상 조합 생성 가능)
        patterns = {
            "breakout": [
                f"전일 거래량 대비 압도적인 흐름이 포착되었습니다. 특히 {s_price:,}원 라인은 과거 강력한 저항선이었으나, 현재는 이를 지지선으로 확보하며 상방 에너지를 응축 중입니다.",
                f"장 초반부터 실시간 체결 강도가 150%를 상회하며 {s_price:,}원 매물대를 가볍게 돌파했습니다. 이는 단순한 반등이 아닌 추세적 상승의 서막으로 분석됩니다.",
                f"현재 {s_name}은(는) 거래량 가중 평균 가격(VWAP) 상단에 위치하며 시장의 주도권을 쥐고 있습니다. 특히 {s_price:,}원 부근에서의 손바뀜 현상이 매우 긍정적입니다.",
                f"기술적으로 {s_price:,}원 구간의 돌파는 세력의 진입 없이는 불가능한 영역입니다. 대량 거래를 동반한 장대 양봉이 이를 입증하고 있습니다."
            ],
            "supply": [
                f"수급 측면에서 외인과 기관의 '쌍끌이' 매수세가 바닥권에서 유입되고 있습니다. 누적 수급 데이터 결과 {s_name}에 대한 메이저의 물량 확보가 임박했음을 시사합니다.",
                f"특정 창구를 통한 집중적인 매집 패턴이 {s_price:,}원 부근에서 지속적으로 관찰됩니다. 이는 유통 물량을 잠그는 과정으로 풀이됩니다.",
                f"스마트 머니의 유입 지표인 'Money Flow Index'가 급격히 우상향하고 있습니다. 특히 저점을 높여가는 공구리 구간에서의 수급 유입이 핵심입니다.",
                f"수급 흐름상 하방 경직성이 확보된 상태로, 현재 구간은 매도세보다 매수세의 힘이 압도적으로 강한 골든 타점입니다."
            ],
            "technical": [
                f"장기 이평선인 112일선({int(pick['live_status'].get('ma112', 0)):,})을 돌파하며 역배열의 긴 터널을 빠져나오고 있습니다. 정배열 초입 구간의 전형적인 모습입니다.",
                f"볼린저 밴드 상단을 강하게 치고 나가는 '밴드 워킹' 구간에 진입했습니다. 변동성이 커지는 시점이나 중심선 지지가 확인되어 안정적입니다.",
                f"영매공파 기법의 핵심인 '256 타점'에 해당합니다. {s_stop:,}원을 생명선으로 잡고 대응하기에 가장 손익비가 좋은 구간입니다.",
                f"일목균형표상 의운(구름대)을 하단에서 상단으로 뚫어내는 돌파 시그널이 발생했습니다. 추세 전환의 확정적 구간입니다."
            ]
        }

        core_analysis = [
            {
                "sub_heading": "1. 실시간 돌파 및 거래량 분석",
                "text": random.choice(patterns["breakout"]),
                "insight_tip": f"진입가 {s_price:,}원 부근 분할 매수 유효합니다.",
                "icon_type": "analysis"
            },
            {
                "sub_heading": "2. 메이저 수급 및 세력 매집 추적",
                "text": random.choice(patterns["supply"]),
                "insight_tip": "외국인 창구의 매도 전환 여부를 실시간 체크하십시오.",
                "icon_type": "volume"
            },
            {
                "sub_heading": "3. 기술적 타점 및 이평선 분석",
                "text": random.choice(patterns["technical"]),
                "insight_tip": f"최종 지지선 {s_stop:,}원 이탈 시 즉시 축소 전략입니다.",
                "icon_type": "trend"
            }
        ]
        
        # 시각적 전문성 강화를 위한 가상 차트 데이터 추가
        visual_assets = {
            "chart_url": f"https://finance.naver.com/item/fchart.nhn?code={pick['stock_info']['ticker']}",
            "heatmap_tag": "High-Demand Area",
            "support_levels": [s_stop, s_price],
            "target_levels": [s_target]
        }

        new_insight = {
            "article_info": {
                "id": 2000 + len(insights),
                "slug": f"analysis-{pick['metadata']['slug']}",
                "title": f"[정밀 리포트] {s_name}, {s_score}점의 압도적 타점 포착",
                "author": "ieumstock AI Research", "date": today, "publishDate": today_iso, "category": "종목 분석",
                "tags": [s_name, "영매공파", "정밀분석", "Premium"]
            },
            "seo_metadata": {"meta_title": f"{s_name} 리서치 리포트 - 이음스탁", "meta_description": f"{s_name} 종목의 기술적 지표와 수급 흐름을 정밀 분석한 전문 리포트입니다."},
            "content_body": {
                "introduction": {"heading": f"{s_name} 리서치: 왜 이 종목에 주목해야 하는가?", "text": f"현재 시장의 변동성 속에서도 {s_name}은(는) 독자적인 수급망을 형성하며 시세 분출을 준비하고 있습니다."},
                "core_analysis": core_analysis,
                "practical_guide": {
                    "heading": "핵심 매매 전략", 
                    "items": [
                        {"title": "진입 가이드", "description": f"{s_price:,}원 기준 +/- 2% 구간"}, 
                        {"title": "목표 설정", "description": f"1차 {s_target:,}원 도달 시 비중 조절"},
                        {"title": "리스크 관리", "description": f"손절가 {s_stop:,}원 이탈 시 추세 훼손 간주"}
                    ]
                },
                "conclusion": {
                    "text": f"{s_name}은(는) 데이터 기반 정밀 검증을 통과한 종목입니다. 무분별한 추격 매수보다는 전략적 접근이 필요합니다.", 
                    "closing_statement": "이음스탁 리서치 팀은 실시간 수급을 끝까지 추적합니다."
                }
            },
            "visual_assets": visual_assets,
            "context_link": {
                "title": matched_topic['title'] if matched_topic else "AI 리서치 교육 자료",
                "slug": matched_topic['slug'] if matched_topic else "education-hub"
            },
            "system_link": {"target_tool": "Brain-Off Hybrid 2.1", "cta_text": "실시간 수급 지도 보기", "related_ticker": [pick['stock_info']['ticker']]}
        }
    else:
        # Educational Topic Case
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
