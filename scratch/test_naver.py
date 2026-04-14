import requests
import re

code = "005930" # Samsung
url = f"https://finance.naver.com/item/sise_day.nhn?code={code}&page=1"
headers = {'User-Agent': 'Mozilla/5.0'}
res = requests.get(url, headers=headers)
res.encoding = 'euc-kr'

print(f"Status Code: {res.status_code}")
print(f"Content Length: {len(res.text)}")

dates = re.findall(r'(\d{4}\.\d{2}\.\d{2})', res.text)
prices = re.findall(r'<span class="tah p11">([\d,]+)</span>', res.text)

print(f"Dates found: {len(dates)}")
print(f"Prices found: {len(prices)}")

if dates:
    print(f"First date: {dates[0]}")
if prices:
    print(f"First price: {prices[0]}")
