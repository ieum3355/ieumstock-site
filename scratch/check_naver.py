import requests
import re

url = "https://finance.naver.com/item/sise_day.nhn?code=003280&page=1"
headers = {'User-Agent': 'Mozilla/5.0'}
res = requests.get(url, headers=headers)
res.encoding = 'euc-kr'
prices = re.findall(r'<span class="tah p11">([\d,]+)</span>', res.text)
dates = re.findall(r'(\d{4}\.\d{2}\.\d{2})', res.text)
hist_data = []
for i in range(len(dates)):
    p_idx = i * 5
    hist_data.append({
        "date": dates[i], "close": int(prices[p_idx].replace(',', '')),
        "high": int(prices[p_idx+2].replace(',', '')), 
        "low": int(prices[p_idx+3].replace(',', '')),
        "volume": int(prices[p_idx+4].replace(',', ''))
    })

for h in hist_data[:5]:
    print(h)
