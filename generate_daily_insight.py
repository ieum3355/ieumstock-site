import json
import os
from datetime import datetime, timedelta

# Path to the dynamic insights file
INSIGHTS_FILE = 'public/daily_insights.json'

# Topics and templates to simulate daily variety
TOPICS = [
    {
        "title": "금리 동결과 시장의 반응: 기회인가 함정인가?",
        "content": "<p>중앙은행의 금리 동결 결정이 내려졌습니다. 시장은 이를 호재로 받아들이는 듯하지만, 기저에 깔린 인플레이션 우려는 여전합니다.</p><h4>핵심 관전 포인트</h4><ul><li>고금리 유지 기간의 장기화 가능성</li><li>기술주 중심의 밸류에이션 재평가</li><li>달러 인덱스 추이에 따른 외국인 수급 변화</li></ul><p>지금은 서둘러 추격 매수하기보다, 현금 비중을 유지하며 지지선을 확인하는 인내심이 필요합니다.</p>"
    },
    {
        "title": "거래량 없는 상승을 경계해야 하는 이유",
        "content": "<p>주가는 오르는데 거래량이 줄어들고 있나요? 이는 상승 동력이 약화되고 있다는 강력한 신호일 수 있습니다.</p><h4>하락 다이버전스의 징후</h4><p>진짜 세력의 매집은 거래량을 숨길 수 없습니다. 개미들만 사는 시장은 사소한 악재에도 무너집니다.</p><div class='highlight-box'><strong>💡 체크리스트</strong><br>평균 거래량 대비 현재 거래량이 얼마나 되는지 확인하세요. 5일 평균 거래량을 하회하는 상승은 '속임수'일 확률이 높습니다.</div>"
    },
    {
        "title": "분산 투자의 진정한 의미: 상관계수 이해하기",
        "content": "<p>단순히 종목 수를 늘리는 것이 분산 투자가 아닙니다. 반도체 종목만 10개 들고 있는 것은 분산이 아닌 '집중 복제'입니다.</p><h4>상관계수가 낮은 자산군 섞기</h4><ul><li>주식과 채권의 비중 조절</li><li>국내 시장과 미국 시장의 배분</li><li>달러 자산 보유를 통한 환차익 방어</li></ul><p>서로 반대로 움직이는 자산을 섞을 때, 포트폴리오의 변동성은 줄어들고 장기 생존 확률은 올라갑니다.</p>"
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
    
    # Check if we already have a post for today
    if any(i['date'] == today for i in insights):
        print(f"Insight for {today} already exists.")
        return

    # Select a topic (round robin or random)
    topic_idx = len(insights) % len(TOPICS)
    new_topic = TOPICS[topic_idx]
    
    new_insight = {
        "id": 1000 + len(insights), # Higher IDs for dynamic content
        "title": new_topic["title"],
        "date": today,
        "publishDate": datetime.now().strftime("%Y-%m-%d"),
        "content": new_topic["content"]
    }

    # Add to list and save
    insights.insert(0, new_insight) # Newest first
    
    with open(INSIGHTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(insights, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully generated new insight for {today}")

if __name__ == "__main__":
    generate_insight()
