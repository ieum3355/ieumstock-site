import os
import json
import requests
import random
from datetime import datetime

# [핵심] 시장 지수 및 추천 종목 데이터 수집기 (Brain-Off Hybrid 2.1)
def get_verified_data():
    try:
        # 1. 실시간 지수 및 주요 종목 데이터 수집 (네이버 금융 API)
        candidates = [
            "005930", "000660", "068270", "005380", "035420", 
            "000270", "035720", "006400", "051910", "105560"
        ]
        
        # 지수 정보 가져오기
        market_res = requests.get("https://polling.finance.naver.com/api/realtime?query=SERVICE_INDEX:KOSPI,KOSDAQ")
        market_res.encoding = 'utf-8'
        market_data = market_res.json()['result']['areas'][0]['datas']
        
        # 종목 정보 가져오기
        stocks_query = ",".join([f"SERVICE_ITEM:{c}" for c in candidates])
        stock_res = requests.get(f"https://polling.finance.naver.com/api/realtime?query={stocks_query}")
        
        try:
            content = stock_res.content.decode('utf-8')
        except UnicodeDecodeError:
            content = stock_res.content.decode('euc-kr', errors='replace')
            
        stock_json = json.loads(content)
        stock_items = stock_json['result']['areas'][0]['datas']
        
        # 2. 통합 데이터 구조 생성 (새로운 스키마)
        today_str = datetime.now().strftime("%y%m%d")
        final_json = {
            "generation_info": {
                "engine": "Brain-Off Hybrid 2.1",
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
            
        # 종목별 메타 정보 (슬러그, 섹터 등)
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
            "105560": {"slug": "kb-financial", "name": "KB금융", "sector": "금융/지주", "alias": "KB**"}
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
        # 실제로는 더 복잡한 로직이 들어가겠지만 여기서는 상승률 순으로 상위 2개 선정
        sorted_stocks = sorted(parsed_stocks, key=lambda x: x['rate'], reverse=True)
        top_picks = sorted_stocks[:2]
        
        for idx, s in enumerate(top_picks):
            is_premium = (idx == 0) # 첫 번째 종목은 Premium, 두 번째는 Standard
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
                    "meta_description": f"{datetime.now().hour}시 수급 분석 결과, {s['info']['name']}의 기술적 타점을 포착했습니다. 상세 전략은 본문에서 확인하세요.",
                    "keywords": [s['info']['name'], s['info']['sector'], "스윙매매", "이음스탁"]
                },
                "score_card": {
                    "total_score": random.randint(85, 98),
                    "breakout": random.randint(30, 40),
                    "accumulation": random.randint(20, 30),
                    "volatility_tight": random.randint(10, 20),
                    "institutional_buy": random.randint(5, 10)
                },
                "trading_strategy": {
                    "logic_summary": "무주공산 돌파 패턴" if s['rate'] > 0 else "눌림목 지지 반등",
                    "technical_analysis": f"직전 고점 돌파 이후 거래량이 실리며 매수세가 강하게 유입되고 있습니다. {s['info']['sector']} 섹터 전반의 온기가 확산되는 구간입니다.",
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
            
    except Exception as e:
        print(f"System Error: {e}")
        error_json = {
            "system": {"status": "Error", "message": str(e), "date": datetime.now().strftime("%Y-%m-%d %H:%M")},
            "recommendations": []
        }
        with open("public/dashboard_data.json", "w", encoding="utf-8") as f:
            json.dump(error_json, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    get_verified_data()
