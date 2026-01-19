import re

DB_PATH = r'c:\Users\sjm12\연습하기\data\content_db.js'

# Read the database file
with open(DB_PATH, 'r', encoding='utf-8') as f:
    db_content = f.read()

# Patterns to replace
replacements = [
    # Remove "선배" from various contexts
    (r'주식 선배로서', ''),
    (r'선배로서', ''),
    (r'선배의 ', ''),
    (r'선배가 주는 ', ''),
    (r'RSI 선배의', 'RSI'),
    (r'볼린저 밴드 선배의', '볼린저 밴드'),
    
    # Remove first-person references
    (r'제가 ', '많은 투자자들이 '),
    (r'저는 ', '경험상 '),
    (r'제 ', ''),
    
    # Tone down arrogant expressions
    (r'아시겠나요\?', ''),
    (r'말이죠', ''),
    
    # Fix specific phrases
    (r'\(선배의 한마디\)', ''),
    (r'선배의 당부 \(진심입니다\)', '중요한 포인트'),
    (r'선배의 호통을 기억하세요', '다음 사항을 기억하세요'),
    (r'선배의 생존 지침', '생존 지침'),
    (r'선배의 생존 수칙', '생존 수칙'),
    (r'선배의 현실 충고', '현실 충고'),
    (r'선배의 실전 솔루션', '실전 솔루션'),
    (r'선배의 실전 체크포인트', '실전 체크포인트'),
    (r'선배의 전략', '전략'),
    (r'선배의 분산 투자 원칙', '분산 투자 원칙'),
    (r'선배의 활용술', '활용 전략'),
    (r'선배의 활용 노하우', '활용 노하우'),
    
    # Clean up double spaces and awkward phrasing
    (r'  +', ' '),
    (r' ,', ','),
    (r' \.', '.'),
]

# Apply all replacements
for pattern, replacement in replacements:
    db_content = re.sub(pattern, replacement, db_content)

# Write back to file
with open(DB_PATH, 'w', encoding='utf-8') as f:
    f.write(db_content)

print('Successfully removed "선배" references and first-person expressions from content_db.js')
