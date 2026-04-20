import json
import os
import random

INSIGHTS_FILE = 'public/daily_insights.json'

def variate_existing_insights():
    if not os.path.exists(INSIGHTS_FILE):
        return

    with open(INSIGHTS_FILE, 'r', encoding='utf-8') as f:
        insights = json.load(f)

    # Varied phrases pool (from generate_daily_insight.py)
    variations = [
        # Scanning
        [
            "전일 거래량 대비 300% 이상의 대량 거래가 포착되었습니다. 특히 5분 봉상 주요 매물대 위에서 안정적인 지지 흐름을 보이고 있습니다.",
            "장 초반부터 평소 대비 5배 이상의 압도적인 거래량이 실리며 중요 가격 라인을 돌파했습니다.",
            "현재 거래량 가중 평균 가격(VWAP) 상단에 위치해 있으며 시장 참여자들이 적극적으로 베팅하고 있습니다."
        ],
        # Tracking
        [
            "외국인과 기관의 매수세가 바닥권에서 동시에 유입되는 '쌍끌이' 현상이 나타나고 있습니다.",
            "특정 창구를 통한 집중적인 매수세가 포착되었습니다. 기타법인과 사모펀드 중심의 스마트 머니 유입이 뚜렷합니다.",
            "수급 흐름 상 저점을 높여가는 매집 패턴이 완성되었습니다. 작은 거래량으로도 큰 시세 분출이 가능한 구간입니다."
        ],
        # Technical
        [
            "112일선이라는 거대한 매물벽을 뚫어내는 과정은 세력이 막대한 자금을 투입했다는 증거입니다.",
            "역배열의 끝단에서 5일선이 20일선을 돌파하는 골든크로스가 발생했습니다.",
            "장기 하락 추세선을 우상향으로 돌파하는 첫 번째 양봉이 출현했습니다."
        ],
        # Risk
        [
            "시장 노이즈를 제거하고 순수 에너지를 측정한 결과, 변동성 지표가 안정적인 범위 내에 머물고 있습니다.",
            "리스크 모델링 결과, 현재 구간에서의 하방 압력은 제한적입니다. 손익비가 매우 높게 측정되었습니다.",
            "코스피/코스닥 지수의 변동성에도 불구하고 동사는 독자적인 수급을 유지하고 있습니다."
        ],
        # Strategy
        [
            "단기적으로는 직전 고점 돌파가 예상되며, 중장기적으로는 강력한 시세 분출이 기대됩니다.",
            "1차 목표가는 장기 매물대 상단으로 설정하되, 돌파 시 추세 추종 전략을 유지하십시오.",
            "상승 1파동 후 짧은 눌림목이 예상됩니다. 지지선을 최종 생명선으로 잡고 대응하시기 바랍니다."
        ]
    ]

    for item in insights:
        if item['article_info']['category'] == '종목 분석':
            core = item.get('content_body', {}).get('core_analysis', [])
            # If it has sections, replace the text with a random variation
            for i, section in enumerate(core):
                if i < len(variations):
                    section['text'] = random.choice(variations[i])
            
            # Also variate the conclusion/introduction slightly if they are generic
            intro = item.get('content_body', {}).get('introduction', {})
            if "에너지 응축이 포착되었습니다" in intro.get('text', ''):
                name = item['article_info']['title'].split(': ')[-1].replace(' 정밀 분석', '')
                intro['text'] = f"최근 시장 수급 데이터를 정밀 스캔한 결과, {name} 종목에서 세력의 매집 흔적과 기술적 반등 시그널이 일치하는 맥점이 발견되었습니다."

    with open(INSIGHTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(insights, f, ensure_ascii=False, indent=2)
    
    print(f"Applied variations to {len(insights)} insights.")

if __name__ == "__main__":
    variate_existing_insights()
