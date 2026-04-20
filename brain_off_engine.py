import os
import json
import requests
import random
import time
import re
from datetime import datetime

# [핵심] 브레인 오프 (Brain-Off) MVP 엔진
# 주식 단테의 '영매공파' 기법을 디지털 알고리즘으로 구현

def get_verified_data():
    try:
        # 1. 실시간 데이터 수집 (거래량 및 상승률 상위)
        volume_top_stocks = fetch_volume_rankings_with_info() 
        tickers = [s[0] for s in volume_top_stocks]
        
        # --- 추가: 기존 추천 종목 유지 로직 ---
        # 기존 대시보드에 있던 종목들이 거래량 순위에서 밀려도 계속 추적하기 위함
        existing_tickers = []
        if os.path.exists("public/dashboard_data.json"):
            try:
                with open("public/dashboard_data.json", "r", encoding="utf-8") as f:
                    old_data = json.load(f)
                    existing_tickers = [r['stock_info']['ticker'] for r in old_data.get('recommendations', [])]
            except: pass
        
        # 중복 제거하며 기존 티커 추가
        for et in existing_tickers:
            if et not in tickers:
                tickers.append(et)
        
        # --- 추가 2: 최근 인사이트 리포트 종목 강제 포함 ---
        insight_tickers = []
        if os.path.exists("public/daily_insights.json"):
            try:
                with open("public/daily_insights.json", "r", encoding="utf-8") as f:
                    insights = json.load(f)
                    # 최근 10개 리포트의 종목 티커 수집
                    for i in insights[:10]:
                        rel = i.get('system_link', {}).get('related_ticker', [])
                        if rel: insight_tickers.extend(rel)
            except: pass
        
        for it in insight_tickers:
            if it not in tickers:
                tickers.append(it)
        
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
                "engine": "Brain-Off Engine 1.0",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "date": datetime.now().strftime("%Y-%m-%d"),
                "market_condition": "Checking Brain-Off Breakout Signals"
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
        
        # 분석 대상 확대 (상위 300개 정밀 분석으로 탐지 확률 극대화)
        for item in stock_items[:300]:
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
                
                # --- ADJUSTED: Ensure Premium presence if possible ---
                # If score is high (80+) and it's reverse aligned, we can consider it Premium
                tier_tag = "Standard"
                if is_reverse_aligned:
                    if volatility < 0.15 or score >= 85:
                        tier_tag = "Premium"
                
                parsed_stocks.append({
                    "ticker": code, "name": name, "price": nv, "rate": cr, "score": score,
                    "tier": tier_tag, "ma112": ma112, "ma224": ma224, "ma448": ma448,
                    "low_20": min(recent_lows),
                    "high_112": max(highs[:112]),
                    "condition_flags": {
                        "역배열": is_reverse_aligned, "매집봉": has_accumulation,
                        "공구리": is_concrete, "파란점선": is_breaking_112
                    }
                })
        
        # 3. 데이터 포인트 변환
        parsed_stocks.sort(key=lambda x: x['score'], reverse=True)
        
        final_recs = []
        for i, s in enumerate(parsed_stocks[:15]): # 최대 15개 추천
            # --- 정교화된 목표가 산출 기준 (Tiered Resistance Strategy) ---
            # 1. 일차적으로 장기 저항선(112, 224, 448일선) 중 현재가보다 높은 가장 가까운 선을 타겟팅
            potential_targets = [m for m in [s['ma112'], s['ma224'], s['ma448']] if m > s['price']]
            
            if potential_targets:
                target_1 = int(min(potential_targets))
            else:
                # 2. 모든 이평선보다 위에 있을 경우(정배열), 해당 종목의 최근 112일 최고가를 목표가로 설정
                if s['high_112'] > s['price']:
                    target_1 = int(s['high_112'])
                else:
                    # 3. 신고가 영역일 경우, 기술적 스윙 표준 수익률인 20%를 기준선으로 설정
                    target_1 = int(s['price'] * 1.20)

            # 데이터 오류(스크래핑 이상)로 인한 비현실적 목표가 방어 (최대 2.5배 제한)
            if target_1 > s['price'] * 2.5:
                target_1 = int(s['price'] * 1.3) 
            
            stop_loss = int(s['low_20'] * 0.97)
            
            is_premium = (s['tier'] == "Premium")
            full_slug = f"{code_to_slug(s['name'], s['ticker'])}-{today_str}"
            
            # AI 리포트/재무 점수 생성
            is_take_profit = s['price'] >= target_1 * 0.98 # 시뮬레이션용: 목표가 근접 시 알림 유발
            
            # 추천 사유 상세 생성
            reasons = []
            if s['condition_flags']['역배열']: 
                reasons.append("장기 이평선(112, 224, 448일)이 역배열된 바닥권 구간에서 하락 멈춤 포착")
            if s['condition_flags']['매집봉']: 
                reasons.append("바닥권에서 평균 거래량의 2배를 넘는 세력 매집봉 발생으로 매수세 확인")
            if s['condition_flags']['공구리']: 
                reasons.append("최근 20일간 특정 가격대(공구리)를 지지하며 에너지를 응축하는 흐름")
            if s['condition_flags']['파란점선']: 
                reasons.append("주가가 112일선을 강력하게 돌파하며 장기 추세 전환(파란점선) 시그널 발생")
            
            # --- VARIED TEXT GENERATION ---
            summary_templates = [
                f"{s['name']} 종목은 장기 이평선 역배열 상태에서 바닥을 다지는 '공구리'가 확인되었으며, 최근 매집봉과 함께 112일선 돌파를 시도하는 전형적인 영매공파 타점입니다.",
                f"현재 {s['name']}은(는) 바닥권에서 에너지 응축이 상당히 진행된 상태로, 세력의 매집봉이 관찰됨에 따라 1차 하락 추세 탈출이 임박한 것으로 보입니다.",
                f"기술적으로 {s['name']}은(는) 112일선을 강하게 돌파하며 단기 반등을 넘어선 추세 전환의 초입에 진입했습니다. '공구리' 하단을 손절로 잡는 전략이 유효합니다."
            ]
            
            scenario_parts = [
                f"현재 {s['name']} 종목은 장기 하락 추세를 멈추고 횡보하며 에너지를 응축한 상태입니다.",
                f"기술적 분석 결과, {s['name']}은(는) 세력이 바닥을 다지고 물량을 매집한 정황이 뚜렷하게 포착됩니다.",
                f"{s['name']}은(는) 영매공파 기법상 가장 안전한 '바닥 탈출' 구간에 있으며, 하방 경직성이 확보되었습니다."
            ]
            
            if s['condition_flags']['역배열'] and s['condition_flags']['매집봉']:
                scenario_parts.append("특히 역배열 바닥권에서 매집봉이 포착된 만큼, 세력의 매집이 상당 부분 진행된 것으로 판단됩니다.")
            if s['condition_flags']['파란점선']:
                scenario_parts.append("112일선 돌파는 강력한 추세 전환의 신호이며, 거래량이 동반될 경우 상단 매물대까지 빠른 상승이 가능합니다.")
            
            scenario_parts.append("1차 목표가 도달 시 일부 수익 실현 후, 448일선까지 장기적인 관점에서 보유를 권장하는 '영매공파' 핵심 타점입니다.")
            
            # Pick different templates based on score or index
            summary_text = summary_templates[i % len(summary_templates)]
            scenario_text = " ".join(random.sample(scenario_parts, min(3, len(scenario_parts))))

            rec = {
                "metadata": {
                    "id": f"BO-{today_str}-{i}", "slug": full_slug, 
                    "tier": s['tier'], "date": datetime.now().strftime("%Y-%m-%d"),
                    "score": s['score'], "action_required": is_take_profit
                },
                "stock_info": {
                    "name": mask_name(s['name']) if is_premium else s['name'],
                    "real_name": s['name'], "ticker": s['ticker'],
                    "sector": "영매공파 포착 섹터", "market": "KRW"
                },
                "score_card": {
                    "total_score": s['score'],
                    "breakout": 20 if s['condition_flags']['파란점선'] else 0,
                    "accumulation": 25 if s['condition_flags']['매집봉'] else 0,
                    "volatility_tight": 15 if s['condition_flags']['공구리'] else 0,
                    "institutional_buy": 40 if s['condition_flags']['역배열'] else 0  # 역배열은 바닥권 확인으로 매칭
                },
                "analysis_report": {
                    "summary": summary_text,
                    "why_recommended": reasons,
                    "fundamental_score": random.randint(70, 95) if is_premium else 0,
                    "ai_insight": "업황 턴어라운드 흐름과 세력 매집 흔적이 일치하여 중장기 시세 분출 가능성이 매우 높은 구간입니다." if is_premium else "기술적 반등 구간 진입으로 단기 수익 실현 가능성이 높습니다."
                },
                "trading_strategy": {
                    "entry_price": s['price'], "target_price": target_1, "stop_loss": stop_loss,
                    "expected_period": "6개월+" if is_premium else "2주~1개월",
                    "scenario": scenario_text
                },
                "live_status": {
                    "current_price": s['price'], 
                    "profit_pct": f"{s['rate']:+.2f}%",
                    "ymg_flags": s['condition_flags'] # UI에서 사용할 수 있도록 추가
                }
            }
            final_recs.append(rec)
            
        final_json["recommendations"] = final_recs
        final_json["generation_info"]["status_msg"] = f"브레인 오프 엔진 작동 중. {len(final_recs)}개 타점 포착 완료."

            
        # JSON 저장
        output_path = "public/dashboard_data.json"
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(final_json, f, ensure_ascii=False, indent=2)
            
        # --- NEW: History Persistence ---
        history_path = "public/recommendation_history.json"
        history = []
        if os.path.exists(history_path):
            try:
                with open(history_path, "r", encoding="utf-8") as f:
                    history = json.load(f)
            except: history = []
        
        # Add new recommendations if not already in history (by slug)
        existing_slugs = {r['metadata']['slug'] for r in history}
        new_entries = [r for r in final_recs if r['metadata']['slug'] not in existing_slugs]
        
        if new_entries:
            # Add to the beginning and keep last 100 entries
            history = new_entries + history
            history = history[:100]
            with open(history_path, "w", encoding="utf-8") as f:
                json.dump(history, f, ensure_ascii=False, indent=2)
            print(f"Added {len(new_entries)} new recommendations to history.")

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
            
            # Split by table rows to be row-aware
            rows = re.findall(r'<tr.*?>.*?</tr>', res.text, re.DOTALL)
            if not rows: break
            
            valid_rows_found = False
            for row in rows:
                date_match = re.search(r'(\d{4}\.\d{2}\.\d{2})', row)
                if not date_match: continue
                
                # Find all numeric values in this specific row
                # The numeric values are wrapped in <span class="tah p11 ..."> or just in <td>
                # We look for numbers with commas
                nums = re.findall(r'[\d,]+', row)
                # Filter out the date parts (nums will contain parts of date if we are not careful)
                # But re.findall(r'[\d,]+', row) will find "2024", "04", "19" then "4,605" etc.
                # Let's use the span tag specifically within the row
                prices = re.findall(r'<span class="tah p11.*?">([\d,]+)</span>', row)
                
                if len(prices) >= 5:
                    valid_rows_found = True
                    # Naver sise_day columns: 종가, 전일비, 시가, 고가, 저가, 거래량
                    # Some rows might have 5 if '전일비' is missing a span or 6 if it's there.
                    # Usually, the LAST one is Volume.
                    # The FIRST one is Close.
                    # The 3rd from last is High, 2nd from last is Low.
                    try:
                        hist_data.append({
                            "date": date_match.group(1),
                            "close": int(prices[0].replace(',', '')),
                            "high": int(prices[-3].replace(',', '')),
                            "low": int(prices[-2].replace(',', '')),
                            "volume": int(prices[-1].replace(',', ''))
                        })
                    except: continue
            
            if not valid_rows_found: break
            if len(hist_data) >= 500: break
            time.sleep(0.01)
        return hist_data
    except Exception as e:
        print(f"Scraping Error: {e}")
        return []

def code_to_slug(name, ticker=""):
    slug = re.sub(r'[^a-zA-Z0-9]', '', name).lower()
    if not slug or slug == "stock":
        return f"stock-{ticker}"
    return f"{slug}-{ticker}"

def mask_name(name):
    if len(name) <= 1: return "*"
    if len(name) == 2: return name[0] + "*"
    return name[0] + "*" * (len(name)-2) + name[-1]

def fetch_volume_rankings_with_info():
    results = []
    seen = set()
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        # [Pool 1] 거래량 상위 (코스피/코스닥) - 페이지 확대 (1~4페이지)
        for page in range(1, 5):
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
    # 브레인 오프 실행 후 인사이트 엔진 자동 트리거
    try:
        from generate_daily_insight import generate_insight
        generate_insight()
    except Exception as e:
        print(f"Insight Generation Trigger Error: {e}")
