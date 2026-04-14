import requests
import json
import re
from datetime import datetime

def debug_engine():
    ts = int(datetime.now().timestamp() * 1000)
    # 1. Fetch Top Volume Stocks
    res = requests.get(f"https://finance.naver.com/sise/sise_quant.nhn?page=1")
    res.encoding = 'euc-kr'
    matches = re.findall(r'code=(\d{6})"[^>]*class="tltle">([^<]+)</a>', res.text)
    
    print(f"Found {len(matches)} potential stocks in Page 1")
    
    for ticker, name in matches[:10]:
        print(f"Testing {name} ({ticker})...")
        # Step 2: Historical Data
        url = f"https://finance.naver.com/item/sise_day.nhn?code={ticker}&page=1"
        hres = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        hres.encoding = 'euc-kr'
        dates = re.findall(r'(\d{4}\.\d{2}\.\d{2})', hres.text)
        prices = re.findall(r'<span class="tah p11">([\d,]+)</span>', hres.text)
        
        if not dates:
            print(f"  FAILED: No historical data")
            continue
            
        hist_data = []
        for i in range(len(dates)):
            p_idx = i * 6
            hist_data.append({
                "close": int(prices[p_idx].replace(',', '')),
                "high": int(prices[p_idx+2].replace(',', '')),
                "volume": int(prices[p_idx+5].replace(',', ''))
            })
            
        if len(hist_data) < 20: 
            print(f"  FAILED: Too few historical days ({len(hist_data)})")
            continue
            
        nv = hist_data[0]['close']
        highs = [h['high'] for h in hist_data]
        closes = [h['close'] for h in hist_data]
        volumes = [h['volume'] for h in hist_data]
        
        cond_A = (nv >= max(highs[1:21]))
        cond_B = (nv >= max(closes[1:21]))
        cond_C = any(volumes[i] >= volumes[i+1] * 1.5 for i in range(10))
        
        print(f"  Price: {nv}, 20d High: {max(highs[1:21])}")
        print(f"  Cond A (High Break): {cond_A}")
        print(f"  Cond B (Close Break): {cond_B}")
        print(f"  Cond C (Vol Spike): {cond_C}")

if __name__ == "__main__":
    debug_engine()
