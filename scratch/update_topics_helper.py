import os

target_file = r'c:\Users\sjm12\이음스탁\generate_daily_insight.py'

new_topics_code = """TOPICS = [
    {
        "category": "Technical Analysis",
        "title": "바닥권 공구리 패턴과 매집의 원리 (영매공파 심화)",
        "slug": "deep-dive-into-concrete-pattern",
        "author": "ieumstock AI Lab",
        "tags": ["영매공파", "공구리패턴", "세력매집", "바닥탈출", "기술적분석"],
        "introduction": {
            "heading": "무너지지 않는 바닥, '공구리'는 세력의 철저한 설계입니다.",
            "text": "단순한 가격 횡보를 넘어, 특정 가격대를 철저하게 방어하며 에너지를 응축하는 '공구리' 패턴은 개인 투자자가 가장 안전하게 수익을 낼 수 있는 구간입니다."
        },
        "core_analysis": [
            {"sub_heading": "1. 장기 이평선 역배열의 수렴과 에너지 응축", "text": "112일선, 224일선 등 장기 이동평균선이 주가와 맞닿으며 수렴하는 구간은 매도세와 매수세가 균형을 이루는 시점입니다.", "insight_tip": "이평선이 꼬여있는 구간에서 거래량이 터지는 캔들을 찾으십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 바닥권 매집봉의 비밀: 윗꼬리의 의미", "text": "공구리 구간 내에서 발생하는 윗꼬리가 긴 매집봉은 세력이 유통 물량을 테스트하고 개인들의 매물을 흡수하는 과정입니다.", "insight_tip": "매집봉의 저점을 깨지 않는 흐름이 유지되어야 진정한 공구리입니다.", "icon_type": "volume"},
            {"sub_heading": "3. 5분 봉상 주요 저항선 돌파 시그널", "text": "전일 거래량 대비 300% 이상의 대량 거래가 5분 봉상 주요 저항선 위에서 유지될 때, 이는 대시세의 서막입니다.", "insight_tip": "거래량이 터지며 직전 고점을 돌파할 때가 강력한 매수 타점입니다.", "icon_type": "trend"}
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
        "introduction": {
            "heading": "요동치는 물가와 금리, 위기는 기회입니다.",
            "text": "글로벌 공급망 불확실성은 시장 변동성을 키우지만 실적이 개선되는 종목은 반드시 존재합니다."
        },
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
        "introduction": {
            "heading": "축제 뒤에 남겨진 개미들의 무덤을 피하십시오.",
            "text": "주가가 급등한 후 세력이 물량을 개인에게 떠넘기는 '설거지'를 읽어야 합니다."
        },
        "core_analysis": [
            {"sub_heading": "1. 고점권 대량 거래 윗꼬리", "text": "역대급 거래량이 터졌음에도 주가가 밀리면 세력이 던지고 있다는 신호입니다.", "insight_tip": "거래량 대비 주가 상승폭이 미미하면 경계하십시오.", "icon_type": "volume"},
            {"sub_heading": "2. 하락 장악형 패턴", "text": "이전 양봉을 집어삼키는 거대 음봉은 추세 하락의 확정 시그널입니다.", "insight_tip": "3거래일 내 고점 회복 실패 시 즉시 축소하십시오.", "icon_type": "risk"},
            {"sub_heading": "3. 재료 소멸과 수급 이탈", "text": "호재 뉴스가 나왔을 때 거래량이 터지며 음봉이 나오면 전형적인 엑싯입니다.", "insight_tip": "뉴스의 선반영 여부를 차트로 판단하십시오.", "icon_type": "analysis"}
        ],
        "practical_guide": {"heading": "대응 매뉴얼", "items": [{"title": "분할 익절 습관", "description": "욕심을 버리고 주요 저항선마다 수익을 확정하십시오."}]},
        "conclusion": {"text": "나갈 때를 아는 투자가 진짜 실력입니다.", "closing_statement": "리스크 관리는 이음스탁과 함께."}
    },
    {
        "category": "Investment Insight",
        "title": "상한가 따라잡기(상따), 세력의 설거지를 피하는 필승 전략",
        "slug": "truth-of-upper-limit-price-trading",
        "author": "ieumstock AI Lab",
        "tags": ["상한가매매", "상따전략", "세력패턴"],
        "introduction": {
            "heading": "화려한 상한가 속 숨겨진 함정",
            "text": "준비되지 않은 상따는 세력의 차익 실현 희생양이 되기 쉽습니다."
        },
        "core_analysis": [
            {"sub_heading": "1. 상한가 설계 의도", "text": "장 초반 10시 이전 문을 닫는 '강한 상한가'는 다음 날 시세를 기대할 수 있습니다.", "insight_tip": "닫는 시간이 늦을수록 약한 상한가입니다.", "icon_type": "analysis"},
            {"sub_heading": "2. 거래량과 잔량의 관계", "text": "상한가 안착 후 거래량이 소멸되어야 진정한 '잠금' 상태입니다.", "insight_tip": "상한가 잔량이 줄어드는 속도를 실시간 체크하십시오.", "icon_type": "volume"},
            {"sub_heading": "3. 익일 시초가 대응", "text": "상따의 수익은 다음 날 시초가 갭에서 결정됩니다.", "insight_tip": "시초가가 3% 미만이면 즉시 탈출을 고려하십시오.", "icon_type": "strategy"}
        ],
        "practical_guide": {"heading": "상따 수칙", "items": [{"title": "비중 조절", "description": "상따는 고위험 매매이므로 전체 자산의 10% 미만으로 운용하십시오."}]},
        "conclusion": {"text": "진짜 주도주를 선별하는 안목이 필수입니다.", "closing_statement": "이음스탁 AI가 도와드립니다."}
    },
    {
        "category": "Technique",
        "title": "바닥권 매집봉의 비밀: 세력의 매수 원가를 계산하는 법",
        "slug": "accumulation-pattern-analysis",
        "author": "ieumstock AI Lab",
        "tags": ["매집봉", "세력원가", "영매공파"],
        "introduction": {
            "heading": "주가는 속여도 거래량은 속일 수 없습니다.",
            "text": "바닥권 윗꼬리 긴 양봉은 개미 물량을 테스트하는 중요한 신호입니다."
        },
        "core_analysis": [
            {"sub_heading": "1. 매집봉의 의미", "text": "강한 저항대를 건드려보고 쏟아지는 물량을 받아내는 과정입니다.", "insight_tip": "거래량이 전일 대비 500% 이상인지 확인하십시오.", "icon_type": "volume"},
            {"sub_heading": "2. 박스권 횡보", "text": "매집봉 이후 주가가 밀리지 않으면 명확한 매집 신호입니다.", "insight_tip": "20일선이 우상향으로 돌아서는 지점을 노리십시오.", "icon_type": "trend"},
            {"sub_heading": "3. 세력 평단가 추정", "text": "매집봉 중심값과 박스권 하단 평균치가 세력 원가일 확률이 높습니다.", "insight_tip": "세력 평단 부근에서 비중을 확대하십시오.", "icon_type": "analysis"}
        ],
        "practical_guide": {"heading": "매수 전략", "items": [{"title": "눌림목 공략", "description": "매집봉 이후 조정 구간에서 분할 매수하십시오."}]},
        "conclusion": {"text": "세력의 평단가를 알면 투자가 쉬워집니다.", "closing_statement": "세력의 흔적을 쫓는 이음스탁."}
    },
    {
        "category": "Strategy",
        "title": "골든크로스의 함정: 가짜 반등에 속지 않는 이평선 활용법",
        "slug": "moving-average-golden-cross-trap",
        "author": "ieumstock AI Lab",
        "tags": ["이평선", "골든크로스", "함정피하기"],
        "introduction": {
            "heading": "누구나 아는 지표는 함정이 될 수 있습니다.",
            "text": "세력은 골든크로스를 이용해 개인에게 물량을 넘기기도 합니다."
        },
        "core_analysis": [
            {"sub_heading": "1. 역배열 상태의 함정", "text": "장기 이평선이 하향 중일 때의 골든크로스는 기술적 반등일 뿐입니다.", "insight_tip": "112, 224일선의 방향을 먼저 확인하십시오.", "icon_type": "analysis"},
            {"sub_heading": "2. 거래량의 중요성", "text": "수급 없는 지표 돌파는 신뢰도가 매우 낮습니다.", "insight_tip": "돌파 시 거래량이 최소 300% 이상 실려야 합니다.", "icon_type": "volume"},
            {"sub_heading": "3. 지지 확인 필수", "text": "돌파 후 해당 이평선을 지지해주는지 여부가 상승을 결정합니다.", "insight_tip": "3거래일 내 재이탈 시 즉시 손절하십시오.", "icon_type": "trend"}
        ],
        "practical_guide": {"heading": "필승 공식", "items": [{"title": "정배열 전환 대기", "description": "이평선들이 정배열로 정렬되는 초입을 노리십시오."}]},
        "conclusion": {"text": "지표는 참고일 뿐, 수급이 본질입니다.", "closing_statement": "이음스탁이 수급의 본질을 읽어드립니다."}
    }
]"""

with open(target_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if line.strip().startswith('TOPICS = ['):
        start_idx = i
    if start_idx != -1 and line.strip() == ']':
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_content = lines[:start_idx] + [new_topics_code + '\\n'] + lines[end_idx+1:]
    with open(target_file, 'w', encoding='utf-8') as f:
        f.writelines(new_content)
    print("Successfully updated TOPICS.")
else:
    print("Could not find TOPICS list.")
"""

with open('scratch/update_topics.py', 'w', encoding='utf-8') as f:
    f.write(new_topics_code_py)

import subprocess
subprocess.run(['python', 'scratch/update_topics.py'], check=True)
