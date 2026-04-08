import os
import json
import requests
from datetime import datetime

# [핵심] 시장 지수 및 추천 종목 데이터 수집기
def get_verified_data():
    try:
        # 1. 실시간 지수 및 주요 종목 데이터 수집 (네이버 금융 API)
        # 추천 후보군 (활성 우량주)
        candidates = [
            "005930", "000660", "068270", "005380", "035420", 
            "000270", "035720", "006400", "051910", "000810",
            "105560", "055550"
        ]
        
        # 지수 정보 가져오기
        market_res = requests.get("https://polling.finance.naver.com/api/realtime?query=SERVICE_INDEX:KOSPI,KOSDAQ")
        market_res.encoding = 'utf-8'
        market_data = market_res.json()['result']['areas'][0]['datas']
        
        # 종목 정보 가져오기
        stocks_query = ",".join([f"SERVICE_ITEM:{c}" for c in candidates])
        stock_res = requests.get(f"https://polling.finance.naver.com/api/realtime?query={stocks_query}")
        
        # Encoding check
        try:
            content = stock_res.content.decode('utf-8')
        except UnicodeDecodeError:
            content = stock_res.content.decode('euc-kr', errors='replace')
            
        stock_json = json.loads(content)
        stock_items = stock_json['result']['areas'][0]['datas']
        
        # 2. 통합 데이터 구조 생성
        final_json = {
            "system": {"status": "Verified", "date": datetime.now().strftime("%Y-%m-%d %H:%M")},
            "market": [],
            "stocks": [] 
        }
        
        # 지수 데이터 파싱
        for item in market_data:
            cd = item.get('cd', '')
            name = "KOSPI" if cd == "KOSPI" else "KOSDAQ"
            raw_val = item.get('nv', 0)
            val = raw_val / 100.0 if raw_val > 50000 else float(raw_val)
            rate = item.get('cr', 0.0)
            final_json["market"].append({
                "name": name, 
                "value": f"{val:,.2f}", 
                "rate": f"{rate:+.2f}"
            })
            
        # 종목 데이터 파싱
        parsed_stocks = []
        name_map = {
            "005930": "삼성전자", "000660": "SK하이닉스", "068270": "셀트리온",
            "005380": "현대차", "035420": "NAVER", "000270": "기아",
            "035720": "카카오", "006400": "삼성SDI", "051910": "LG화학",
            "000810": "삼성화재", "105560": "KB금융", "055550": "신한지주"
        }
        
        for item in stock_items:
            code = item.get('cd', '')
            nm = item.get('nm', 'Unknown')
            disp_name = name_map.get(code, nm)
            
            parsed_stocks.append({
                "name": disp_name,
                "price": f"{item.get('nv', 0):,}",
                "rate": float(item.get('cr', 0.0)),
                "cv": item.get('cv', 0)
            })
            
        # [AI 추천 로직: 상승률 상위 3-4종목]
        sorted_stocks = sorted(parsed_stocks, key=lambda x: x['rate'], reverse=True)
        top_recommendations = sorted_stocks[:4]
        
        for s in top_recommendations:
            price_int = int(s['price'].replace(',', ''))
            target = int(price_int * 1.13 / 100) * 100
            
            reason = "기술적 지지선 반등"
            if s['rate'] > 5: reason = "전 거래일 대비 급등세"
            elif s['rate'] > 2: reason = "수급 집중 및 추세 강화"
            
            final_json["stocks"].append({
                "id": len(final_json["stocks"]) + 1,
                "name": s['name'],
                "price": s['price'],
                "target": f"{target:,}",
                "rate": f"{s['rate']:+.2f}",
                "reason": reason
            })
            
        # 3. 데이터 저장
        output_path = "public/dashboard_data.json"
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(final_json, f, ensure_ascii=False, indent=2)
            
        print(f"Update Successful: {len(final_json['stocks'])} stocks selected.")
            
    except Exception as e:
        print(f"System Error: {e}")
        error_json = {
            "system": {"status": "Error", "message": str(e), "date": datetime.now().strftime("%Y-%m-%d %H:%M")},
            "market": [],
            "stocks": []
        }
        with open("public/dashboard_data.json", "w", encoding="utf-8") as f:
            json.dump(error_json, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    get_verified_data()
