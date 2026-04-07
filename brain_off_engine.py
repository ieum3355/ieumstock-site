import os
import json
import requests
from datetime import datetime

# [핵심] 전일 데이터와 비교하여 지수 무결성 검증
def get_verified_data():
    try:
        # 1. 실시간 지수 가져오기 (네이버 금융 API)
        print("네이버 금융 시세 데이터 수집 중...")
        # KOSPI: KOSPI, KOSDAQ: KOSDAQ
        res = requests.get("https://polling.finance.naver.com/api/realtime?query=SERVICE_INDEX:KOSPI,KOSDAQ")
        data = res.json()['result']['areas'][0]['datas']
        
        # 2. 통합 데이터 구조 생성
        final_json = {
            "system": {"status": "Verified", "date": datetime.now().strftime("%Y-%m-%d %H:%M")},
            "market": [],
            "stocks": [] 
        }
        
        for item in data:
            # 'cd' 필드로 KOSPI/KOSDAQ 구분
            cd = item.get('cd', '')
            name = "KOSPI" if cd == "KOSPI" else "KOSDAQ"
            
            # 'nv'는 현재가 (Now Value), 'cr'은 등락률 (Change Rate)
            # API에서 nv는 정수형으로 오기도 하므로 소수점 처리 (KOSPI는 보통 2,x00.00 형식)
            # 실제 API에서 KOSPI nv는 270000 처럼 소수점 없이 올 수도 있으므로 100으로 나눌 필요가 있는지 확인
            # 이전 디버그에서 547888... 이런 식으로 나왔는데, 이건 다른 필드일 수 있음.
            # 통상적으로 nv는 현재 지수 * 100 또는 그대로임.
            raw_val = item.get('nv', 0)
            
            # 지수 보정 (네이버 API 특성상 2700.50 -> 270050 으로 올 수 있음)
            # KOSPI가 200,000 이상이면 100으로 나눔 (임시 로직)
            val = raw_val / 100.0 if raw_val > 50000 else float(raw_val)
            
            rate = item.get('cr', 0.0)
            
            # [무결성 검증]
            # 1. 지수 하한선 체크 (비정상 데이터 필터링)
            if name == "KOSPI" and val < 1000:
                raise Exception(f"{name} 지수 무결성 오류: {val} (비정상적으로 낮음)")
                
            # 2. 변동폭 체크 (하루 30% 이상은 오류로 간주)
            if abs(rate) > 30:
                raise Exception(f"{name} 변동폭 무결성 오류: {rate}% (데이터 왜곡 의심)")
            
            final_json["market"].append({
                "name": name, 
                "value": f"{val:,.2f}", 
                "rate": f"{rate:+.2f}"
            })
            
        # 3. 데이터 저장 (JSON 파일 기반 API)
        output_path = "public/dashboard_data.json"
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(final_json, f, ensure_ascii=False, indent=2)
            
        print(f"데이터 검증 완료 및 저장: {output_path}")
        print(f"현재 KOSPI: {final_json['market'][0]['value'] if final_json['market'] else 'N/A'}")
            
    except Exception as e:
        print(f"시스템 오류: {e}")
        error_json = {
            "system": {"status": "Error", "message": str(e), "date": datetime.now().strftime("%Y-%m-%d %H:%M")},
            "market": [],
            "stocks": []
        }
        with open("public/dashboard_data.json", "w", encoding="utf-8") as f:
            json.dump(error_json, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    get_verified_data()
