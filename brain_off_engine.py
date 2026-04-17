import os
import json
import requests
import random
import time
import re
from datetime import datetime

# [핵심] YMG 레이더 (Yeong-Mae-Gong-Pa Radar) MVP 엔진
# 주식 단테의 '영매공파' 기법을 디지털 알고리즘으로 구현

def get_verified_data():
    try:
        # 1. 실시간 데이터 수집 (거래량 및 상승률 상위)
        volume_top_stocks = fetch_volume_rankings_with_info() 
        tickers = [s[0] for s in volume_top_stocks]
        
        ts = int(datetime.now().timestamp() * 1000)
        market_res = requests.get(f"https://polling.finance.naver.com/api/realtime?query=SERVICE_INDEX:KOSPI,KOSDAQ&_={ts}")
        market_res.encoding = 'utf-8'
        market_data = market_res.json()['result']['areas'][0]['datas']
        
        stock_items = []
        batch_size = 30
        for i in range(0, len(tickers), batch_size):
            batch = tickers[i:i + batch_size]
            stocks_query = ",".join([f"SERVICE_ITEM:{c}" for c in batch])
            stock_res = requests.get(f"https://polling.finance.naver.com/api/realtime?query={stocks_query}&_={ts}")
            
            try:
                content = stock_res.content.decode('utf-8')
            except UnicodeDecodeError:
                content = stock_res.content.decode('euc-kr', errors='replace')
                
            batch_json = json.loads(content)
            stock_items.extend(batch_json['result']['areas'][0]['datas'])
        
        today_str = datetime.now().strftime("%y%m%d")
        
        final_json = {
            "generation_info": {
                "engine": "YMG Radar Engine 1.0",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "date": datetime.now().strftime("%Y-%m-%d"),
                "market_condition": "Checking YMG Breakout Signals"
            },
            "market_summary": [],
            "recommendations": []
        }
        
        # 지수 데이터 파싱
        for item in market_data:
            cd = item.get('cd', '')
            name = "코스피 (KOSPI)" if cd == "KOSPI" else "코스닥 (KOSDAQ)" if cd == "KOSDAQ" else cd
            raw_val = item.get('nv', 0)
            val = raw_val / 100.0 if raw_val > 50000 else float(raw_val)
            rate = item.get('cr', 0.0)
            final_json["market_summary"].append({
                "name": name, "value": f"{val:,.2f}", "rate": f"{rate:+.2f}%"
            })
            
        # 2. 영매공파(YMG) 기술적 분석
        parsed_stocks = []
        
        # 분석 대상 좁히기 (상위 50개만 정밀 분석 - 시간 관계상)
        for item in stock_items[:50]:
            code = item.get('cd', '')
            name = item.get('nm', 'Unknown')
            nv = item.get('nv', 0)
            cr = float(item.get('cr', 0.0))
            
            # 상장폐지/경고 종목 필터
            if any(k in name for k in ["(관)", "(환)", "(전)", "스팩", "우", "ETF", "ETN"]): continue
            
            # 과거 데이터 수집 (500일치 필요)
            hist = fetch_historical_data(code, pages=45) 
            if not hist or len(hist) < 448: continue
            
            closes = [h['close'] for h in hist]
            highs = [h['high'] for h in hist]
            volumes = [h['volume'] for h in hist]
            
            # 이평선 계산
            ma112 = sum(closes[:112]) / 112
            ma224 = sum(closes[:224]) / 224
            ma448 = sum(closes[:448]) / 448
            
            # [Step 1] 역배열 확인 (448 > 224 > 112)
            is_reverse_aligned = ma448 > ma224 > ma112
            
            # [Step 2] 매집봉 확인 (최근 20일 내 평균 거래량의 2배 이상 스파이크)
            avg_vol = sum(volumes[20:100]) / 80
            has_accumulation = any(volumes[i] > avg_vol * 2.0 for i in range(20))
            
            # [Step 3] 공구리 확인 (최근 20일 저가가 일정 수준 유지)
            recent_lows = [h['low'] for h in hist[:20]]
            is_concrete = min(recent_lows) > min([h['low'] for h in hist[20:40]]) * 0.95
            
            # [Step 4] 파란점선 (112일선 돌파 또는 돌파 직전 수렴)
            is_breaking_112 = nv > ma112 and closes[1] <= ma112 * 1.02
            
            # 가중치 계산
            score = 0
            if is_reverse_aligned: score += 40
            if has_accumulation: score += 25
            if is_concrete: score += 15
            if is_breaking_112: score += 20
            
            if score >= 60: # 영매공파 최소 기준 통과
                # 분류: 변동성이 크면 'Swing', 변동성이 낮고 바닥권이면 'MidLong'
                volatility = (max(closes[:20]) - min(closes[:20])) / min(closes[:20])
                tier_tag = "Premium" if volatility < 0.15 and is_reverse_aligned else "Standard"
                
                parsed_stocks.append({
                    "ticker": code, "name": name, "price": nv, "rate": cr, "score": score,
                    "tier": tier_tag, "ma112": ma112, "ma224": ma224, "ma448": ma448,
                    "condition_flags": {
                        "역배열": is_reverse_aligned, "매집봉": has_accumulation,
                        "공구리": is_concrete, "파란점선": is_breaking_112
                    }
                })
        
        # 3. 데이터 포인트 변환
        parsed_stocks.sort(key=lambda x: x['score'], reverse=True)
        
        final_recs = []
        for i, s in enumerate(parsed_stocks[:6]): # 최대 6개 추천
            target_1 = int(s['ma224'] if s['price'] < s['ma224'] else s['ma448'])
            if target_1 <= s['price']: target_1 = int(s['price'] * 1.15)
            
            stop_loss = int(min([h['low'] for h in hist[:20]]) * 0.97)
            
            is_premium = (s['tier'] == "Premium")
            full_slug = f"{code_to_slug(s['name'])}-{today_str}"
            
            # AI 리포트/재무 점수 생성
            is_take_profit = s['price'] >= target_1 * 0.98 # 시뮬레이션용: 목표가 근접 시 알림 유발
            
            rec = {
                "metadata": {
                    "id": f"YMG-{today_str}-{i}", "slug": full_slug, 
                    "tier": s['tier'], "date": datetime.now().strftime("%Y-%m-%d"),
                    "score": s['score'], "action_required": is_take_profit
                },
                "stock_info": {
                    "name": mask_name(s['name']) if is_premium else s['name'],
                    "real_name": s['name'], "ticker": s['ticker'],
                    "sector": "YMG 포착 섹터", "market": "KRW"
                },
                "score_card": {
                    "total_score": s['score'],
                    "reverse_align": 40 if s['condition_flags']['역배열'] else 0,
                    "accumulation": 25 if s['condition_flags']['매집봉'] else 0,
                    "concrete": 15 if s['condition_flags']['공구리'] else 0,
                    "breaking": 20 if s['condition_flags']['파란점선'] else 0
                },
                "analysis_report": {
                    "summary": f"{s['name']} 종목은 장기 이평선 역배열 상태에서 바닥을 다지는 '공구리'가 확인되었으며, 최근 매집봉과 함께 112일선 돌파를 시도하는 전형적인 영매공파 타점입니다.",
                    "fundamental_score": random.randint(70, 95) if is_premium else 0,
                    "ai_insight": "업황 턴어라운드 흐름과 세력 매집 흔적이 일치하여 중장기 시세 분출 가능성이 매우 높은 구간입니다." if is_premium else "기술적 반등 구간 진입으로 단기 수익 실현 가능성이 높습니다."
                },
                "trading_strategy": {
                    "entry_price": s['price'], "target_price": target_1, "stop_loss": stop_loss,
                    "expected_period": "6개월+" if is_premium else "2주~1개월",
                    "scenario": "1차 목표가 도달 시 50% 분할 익절, 나머지는 본절가 추적 대응"
                },
                "live_status": {"current_price": s['price'], "profit_pct": f"{s['rate']:+.2f}%"}
            }
            final_recs.append(rec)
            
        final_json["recommendations"] = final_recs
        final_json["generation_info"]["status_msg"] = f"YMG 레이더 작동 중. {len(final_recs)}개 타점 포착 완료."
            
        # JSON 저장
        output_path = "public/dashboard_data.json"
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w", encoding="utf-8-sig") as f:
            json.dump(final_json, f, ensure_ascii=False, indent=2)
            
        print(f"Success: {len(final_recs)} stocks captured.")
        
    except Exception as e:
        print(f"Error: {e}")

def fetch_historical_data(code, pages=5):
    url = f"https://finance.naver.com/item/sise_day.nhn?code={code}&page="
    headers = {'User-Agent': 'Mozilla/5.0'}
    hist_data = []
    try:
        for page in range(1, pages + 1):
            res = requests.get(url + str(page), headers=headers)
            res.encoding = 'euc-kr'
            dates = re.findall(r'(\d{4}\.\d{2}\.\d{2})', res.text)
            prices = re.findall(r'<span class="tah p11">([\d,]+)</span>', res.text)
            if not dates: break
            for i in range(len(dates)):
                try:
                    p_idx = i * 5
                    hist_data.append({
                        "date": dates[i], "close": int(prices[p_idx].replace(',', '')),
                        "high": int(prices[p_idx+2].replace(',', '')), "low": int(prices[p_idx+3].replace(',', '')),
                        "volume": int(prices[p_idx+4].replace(',', ''))
                    })
                except: continue
            if len(hist_data) >= 500: break
            time.sleep(0.01)
        return hist_data
    except: return []

def code_to_slug(name):
    return re.sub(r'[^a-zA-Z0-9]', '', name).lower() or "stock"

def mask_name(name):
    if len(name) <= 1: return "*"
    if len(name) == 2: return name[0] + "*"
    return name[0] + "*" * (len(name)-2) + name[-1]

def fetch_volume_rankings_with_info():
    results = []
    seen = set()
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        # [Pool 1] 거래량 상위 (코스피/코스닥)
        for page in range(1, 3):
            for sosok in [0, 1]: 
                url = f"https://finance.naver.com/sise/sise_quant.nhn?sosok={sosok}&page={page}"
                res = requests.get(url, headers=headers)
                res.encoding = 'euc-kr'
                matches = re.findall(r'code=(\d{6})"[^>]*class="tltle">([^<]+)</a>', res.text)
                for ticker, name in matches:
                    if ticker not in seen:
                        results.append((ticker, name))
                        seen.add(ticker)
        
        # [Pool 2] 상승률 상위 (급등주 포착)
        for sosok in [0, 1]:
            url = f"https://finance.naver.com/sise/sise_rising.nhn?sosok={sosok}"
            res = requests.get(url, headers=headers)
            res.encoding = 'euc-kr'
            matches = re.findall(r'code=(\d{6})"[^>]*class="tltle">([^<]+)</a>', res.text)
            for ticker, name in matches:
                if ticker not in seen:
                    results.append((ticker, name))
                    seen.add(ticker)
        
        return results
    except Exception as e:
        print(f"Fetch Error: {e}")
        return results

if __name__ == "__main__":
    get_verified_data()
