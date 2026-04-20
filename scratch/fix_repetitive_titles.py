import json
import os
import random

INSIGHTS_FILE = 'public/daily_insights.json'

def fix_repetitive_titles():
    if not os.path.exists(INSIGHTS_FILE):
        return

    with open(INSIGHTS_FILE, 'r', encoding='utf-8') as f:
        insights = json.load(f)

    title_variations = {
        "상한가 따라잡기(상따), 세력의 설거지를 피하는 3가지 필승 전략": [
            "상한가 매매의 진실: 세력이 개인에게 물량을 떠넘기는 '설거지' 포착법",
            "상따 성공의 법칙: 장 초반 10시 이전 강한 상한가만 노려야 하는 이유",
            "상한가 잔량의 역설: 대량 거래가 터지는 상한가는 익일 갭하락의 징후",
            "상한가 굳히기 전략: 세력의 의도를 읽는 호가창 분석 심화 과정",
            "상따 수익 실현 매뉴얼: 시초가 갭에서 결정되는 매도 타이밍의 비밀"
        ],
        "개미 투자자가 90% 확률로 실패하는 이유: 뇌동매매와 손절의 심리학": [
            "투자의 적은 내부에 있다: 손절을 못 하는 심리적 기제와 극복 방안",
            "뇌동매매 탈출하기: 사전에 정해진 원칙 매매가 계좌를 지키는 유일한 길",
            "심리 매매의 정석: 공포에 사고 환희에 파는 역발상 투자자의 마인드셋",
            "확증 편향의 오류: 내가 산 종목이 오를 수밖에 없다고 믿는 착각의 늪",
            "손익비의 마법: 승률보다 중요한 것은 한 번 수익 낼 때의 크기입니다"
        ],
        "금리 변동성과 주식 시장의 상관관계: 하이퍼 인플레이션 시대의 생존법": [
            "금리 인상기 주도주 선별법: 현금 흐름이 풍부한 가치주에 주목해야 하는 이유",
            "인플레이션 헤지 전략: 화폐 가치 하락을 방어하는 우량 자산 배분 모델",
            "매크로 지표 읽기: 연준의 발언과 금리 점도표가 시장에 미치는 실질적 영향",
            "고금리 시대의 옥석 가리기: 부채 비율이 낮은 재무 건전 기업 리스트업",
            "금리와 환율의 이중주: 외국인 수급이 결정되는 환율 임계치 분석"
        ],
        "공구리 패턴: 바닥권 매수 타점의 정석과 세력의 매집 원리": [
            "공구리 패턴 심화: 바닥을 다지는 박스권 횡보 구간에서의 매집량 계산법",
            "영매공파의 핵심: 장기 이평선 역배열 탈출의 첫 번째 시그널 포착",
            "바닥권 매집봉 해석: 윗꼬리가 긴 양봉이 세력의 매집인 증거 3가지",
            "에너지 응축의 임계점: 공구리 돌파 시 거래량이 실리는 캔들 분석",
            "안전한 바닥 매수: 손절가는 짧고 수익은 길게 가져가는 공구리 기법"
        ]
    }

    for item in insights:
        old_title = item['article_info']['title']
        if old_title in title_variations:
            variants = title_variations[old_title]
            # Use ID to pick one, if it's the same variant again later, we'll add a suffix or just let it be
            # To avoid infinite loop, we just pick by modulo
            idx = int(item['article_info']['id']) % len(variants)
            new_title = variants[idx]
            
            # Add a subtle suffix if it's an old post to ensure some uniqueness
            if int(item['article_info']['id']) < 1050:
                new_title += f" (심화 리서치)"
            
            item['article_info']['title'] = new_title
            
            # Update intro
            intro = item.get('content_body', {}).get('introduction', {})
            text = intro.get('text', '')
            if "상한가는" in text:
                intro['text'] = "세력이 개인 투자자들을 유혹하기 위해 만드는 화려한 상한가 속에는 치명적인 함정이 숨겨져 있습니다."
            elif "아무리 훌륭한" in text:
                intro['text'] = "인간의 본능은 주식 시장에서 손실을 극대화하도록 설계되어 있습니다. 이를 이겨내는 시스템이 필요합니다."
            elif "금리는 자본주의" in text:
                intro['text'] = "유동성의 파티가 끝나고 금리가 오르는 시기, 시장의 돈은 어디로 이동하는지 분석합니다."
            elif "주가가 장기" in text:
                intro['text'] = "더 이상 내려가지 않는 바닥, 세력이 만든 지지 라인인 '공구리' 패턴의 기술적 원리를 분석합니다."

    with open(INSIGHTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(insights, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully fixed repetitive titles.")

if __name__ == "__main__":
    fix_repetitive_titles()
