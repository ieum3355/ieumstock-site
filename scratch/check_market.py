import requests
from datetime import datetime

ts = int(datetime.now().timestamp() * 1000)
res = requests.get(f"https://polling.finance.naver.com/api/realtime?query=SERVICE_INDEX:KOSPI,KOSDAQ&_={ts}")
print(res.text)
