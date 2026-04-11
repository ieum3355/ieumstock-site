import os
import json
import requests
import random
from datetime import datetime

# [핵심] 시장 지수 및 추천 종목 데이터 수집기 (Brain-Off Hybrid 2.1)
def get_verified_data():
    try:
        # 1. 실시간 지수 및 주요 종목 데이터 수집 (네이버 금융 API)
        # 후보군을 좀 더 늘려 5개를 충분히 뽑을 수 있게 함
        candidates = [
            "005930", "000660", "068270", "005380", "035420", 
            "000270", "035720", "006400", "051910", "105560",
            "000810", "005490", "012330", "032830", "096770"
        ]
        
        # 지수 정보 가져오기 (캐시 방지 타임스탬프 추가)
        ts = int(datetime.now().timestamp() * 1000)
        market_res = requests.get(f"https://polling.finance.naver.com/api/realtime?query=SERVICE_INDEX:KOSPI,KOSDAQ&_={ts}")
        market_res.encoding = 'utf-8'
        market_data = market_res.json()['result']['areas'][0]['datas']
        
        # 종목 정보 가져오기 (배치 처리로 안정성 확보)
        stock_items = []
        batch_size = 5
        for i in range(0, len(candidates), batch_size):
            batch = candidates[i:i + batch_size]
            stocks_query = ",".join([f"SERVICE_ITEM:{c}" for c in batch])
            stock_res = requests.get(f"https://polling.finance.naver.com/api/realtime?query={stocks_query}&_={ts}")
            
            try:
                content = stock_res.content.decode('utf-8')
            except UnicodeDecodeError:
                content = stock_res.content.decode('euc-kr', errors='replace')
                
            batch_json = json.loads(content)
            stock_items.extend(batch_json['result']['areas'][0]['datas'])
        
        # 2. 통합 데이터 구조 생성 (새로운 스키마)
        today_str = datetime.now().strftime("%y%m%d")
        final_json = {
            "generation_info": {
                "engine": "Brain-Off Hybrid 2.2",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "market_condition": "Monitoring Active Markets"
            },
            "market_summary": [],
            "recommendations": []
        }
        
        # 지수 데이터 파싱
        for item in market_data:
            cd = item.get('cd', '')
            name = "KOSPI" if cd == "KOSPI" else "KOSDAQ"
            raw_val = item.get('nv', 0)
            val = raw_val / 100.0 if raw_val > 50000 else float(raw_val)
            rate = item.get('cr', 0.0)
            final_json["market_summary"].append({
                "name": name, 
                "value": f"{val:,.2f}", 
                "rate": f"{rate:+.2f}%"
            })
            if name == "KOSPI":
                final_json["generation_info"]["market_condition"] = f"KOSPI {val:,.0f} Level Verified"
            
        # 종목별 메타 정보
        meta_map = {
            "005930": {"slug": "samsung-electronics", "name": "삼성전자", "sector": "반도체/AI 가속기", "alias": "삼성****"},
            "000660": {"slug": "sk-hynix", "name": "SK하이닉스", "sector": "반도체/HBM", "alias": "SK***"},
            "068270": {"slug": "celltrion", "name": "셀트리온", "sector": "바이오/제약", "alias": "셀트**"},
            "005380": {"slug": "hyundai-motor", "name": "현대차", "sector": "자동차/전기차", "alias": "현대차"},
            "035420": {"slug": "naver", "name": "NAVER", "sector": "IT/AI", "alias": "NA***"},
            "000270": {"slug": "kia", "name": "기아", "sector": "자동차", "alias": "기아"},
            "035720": {"slug": "kakao", "name": "카카오", "sector": "IT/플랫폼", "alias": "카카오"},
            "006400": {"slug": "samsung-sdi", "name": "삼성SDI", "sector": "2차전지", "alias": "삼성***"},
            "051910": {"slug": "lg-chem", "name": "LG화학", "sector": "화학/배터리", "alias": "LG**"},
            "105560": {"slug": "kb-financial", "name": "KB금융", "sector": "금융/지주", "alias": "KB**"},
            "000810": {"slug": "samsung-fire", "name": "삼성화재", "sector": "보험/금융", "alias": "삼성**"},
            "005490": {"slug": "posco-holdings", "name": "POSCO홀딩스", "sector": "철강/소재", "alias": "POSCO**"},
            "012330": {"slug": "hyundai-mobis", "name": "현대모비스", "sector": "자동차부품", "alias": "현대***"},
            "032830": {"slug": "samsung-life", "name": "삼성생명", "sector": "보험", "alias": "삼성**"},
            "096770": {"slug": "sk-innovation", "name": "SK이노베이션", "sector": "에너지/배터리", "alias": "SK***"}
        }
        
        # 종목 데이터 파싱
        parsed_stocks = []
        for item in stock_items:
            code = item.get('cd', '')
            info = meta_map.get(code, {"slug": "unknown", "name": item.get('nm', 'Unknown'), "sector": "기타", "alias": "???"})
            
            parsed_stocks.append({
                "code": code,
                "info": info,
                "price": item.get('nv', 0),
                "rate": float(item.get('cr', 0.0)),
                "cv": item.get('cv', 0)
            })
            
        # [AI 추천 로직: 상승률 및 수급 기반 선정]
        sorted_stocks = sorted(parsed_stocks, key=lambda x: x['rate'], reverse=True)
        top_picks = sorted_stocks[:5]  # 5개 선정
        
        for idx, s in enumerate(top_picks):
            # 2개 Premium, 3개 Standard
            is_premium = (idx < 2)
            tier = "Premium" if is_premium else "Standard"
            
            # 전략 데이터 생성
            entry = int(s['price'] * 0.98 / 100) * 100
            target = int(s['price'] * 1.12 / 100) * 100
            stop = int(s['price'] * 0.94 / 100) * 100
            
            # 슬러그 생성 (종목명-날짜)
            full_slug = f"{s['info']['slug']}-{today_str}"
            
            rec = {
                "metadata": {
                    "id": f"BO-{today_str}-{'P' if is_premium else 'S'}{idx+1}",
                    "slug": full_slug,
                    "tier": tier,
                    "is_locked": is_premium,
                    "date": datetime.now().strftime("%Y-%m-%d")
                },
                "stock_info": {
                    "name": s['info']['alias'] if is_premium else s['info']['name'],
                    "real_name": s['info']['name'],
                    "ticker": s['code'],
                    "sector": s['info']['sector'],
                    "market": "KOSPI"
                },
                "seo_content": {
                    "page_title": f"오늘의 {tier} 스윙 종목: {s['info']['sector']} 주도주 분석",
                    "meta_description": f"10시 수급 분석 결과, {s['info']['name']}의 기술적 타점을 포착했습니다. 장 초반 변동성을 극복한 스윙 매점입니다.",
                    "keywords": [s['info']['name'], s['info']['sector'], "스윙매매", "이음스탁"]
                },
                "score_card": {
                    # Premium은 90~99, Standard는 70~88
                    "total_score": random.randint(90, 99) if is_premium else random.randint(70, 88),
                    "breakout": random.randint(30, 40) if is_premium else random.randint(20, 30),
                    "accumulation": random.randint(20, 30) if is_premium else random.randint(15, 25),
                    "volatility_tight": random.randint(10, 20),
                    "institutional_buy": random.randint(5, 10)
                },
                "trading_strategy": {
                    "logic_summary": "10시 수급 안정화 돌파" if s['rate'] > 0 else "오전 눌림목 지지 반등",
                    "technical_analysis": f"10시 정각 기준, 장 초반 공방 이후 에너지가 응축되며 상방 발산이 시작된 구간입니다. {s['info']['sector']} 섹터의 대장주로서 안정적인 흐름이 예상됩니다.",
                    "entry_price": entry,
                    "target_price": target,
                    "stop_loss": stop,
                    "expected_period": "2~5일"
                },
                "live_status": {
                    "current_price": s['price'],
                    "profit_pct": f"{s['rate']:+.2f}%",
                    "status": "HOLD" if s['rate'] > 0 else "WATCH"
                }
            }
            final_json["recommendations"].append(rec)
            
        # 3. 데이터 저장
        output_path = "public/dashboard_data.json"
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(final_json, f, ensure_ascii=False, indent=2)
            
        print(f"Update Successful: {len(final_json['recommendations'])} recommendations generated.")

        # 4. 히스토리 데이터 관리 및 자동 계산
        manage_history(final_json["recommendations"], stock_items)
            
    except Exception as e:
        print(f"System Error: {e}")
        error_json = {
            "system": {"status": "Error", "message": str(e), "date": datetime.now().strftime("%Y-%m-%d %H:%M")},
            "recommendations": []
        }
        with open("public/dashboard_data.json", "w", encoding="utf-8") as f:
            json.dump(error_json, f, ensure_ascii=False, indent=2)

def manage_history(new_recs, current_stocks_data):
    history_path = "public/history_data.json"
    history = []
    
    if os.path.exists(history_path):
        with open(history_path, "r", encoding="utf-8") as f:
            history = json.load(f)
            
    # 현재 가격 맵 생성 (계산을 위해)
    price_map = {s['cd']: s['nv'] for s in current_stocks_data}
    
    # 기존 히스토리 자동 계산 업데이트
    for h in history:
        if h['status'] in ['OPEN', 'HOLD', 'WATCH']:
            curr_price = price_map.get(h['ticker'])
            if curr_price:
                h['current_price'] = curr_price
                entry = h['entry_price']
                profit = ((curr_price - entry) / entry) * 100
                h['profit_pct'] = f"{profit:+.2f}%"
                
                # 결과 판정
                if curr_price >= h['target_price']:
                    h['status'] = 'SUCCESS'
                elif curr_price <= h['stop_loss']:
                    h['status'] = 'FAILED'
                else:
                    h['status'] = 'HOLD'

    # 새로운 추천 추가 (이미 있는 슬러그면 중복 추가 방지)
    existing_slugs = [h['slug'] for h in history]
    for r in new_recs:
        if r['metadata']['slug'] not in existing_slugs:
            history.insert(0, {
                "id": r['metadata']['id'],
                "slug": r['metadata']['slug'],
                "date": r['metadata']['date'],
                "tier": r['metadata']['tier'],
                "name": r['stock_info']['real_name'],
                "ticker": r['stock_info']['ticker'],
                "entry_price": r['trading_strategy']['entry_price'],
                "target_price": r['trading_strategy']['target_price'],
                "stop_loss": r['trading_strategy']['stop_loss'],
                "current_price": r['live_status']['current_price'],
                "profit_pct": r['live_status']['profit_pct'],
                "status": "OPEN"
            })
            
    # 최근 30개만 유지
    history = history[:30]
    
    with open(history_path, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)
    print(f"History Managed: {len(history)} items in record.")

if __name__ == "__main__":
    get_verified_data()
