import re
import json

# Read the file
with open('c:/Users/sjm12/연습하기/data/content_db.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Comprehensive list of all encoding fixes needed
replacements = {
    '따져봅��다': '따져봅니다',
    '펼��보면': '펼쳐보면',
    '잡��� 것이': '잡는 것이',
    '따져봐야� 합니다': '따져봐야 합니다',
    '��업 분석': '기업 분석',
    'RSI 과매수 구간 ��입': 'RSI 과매수 구간 진입',
    '자체���으로': '자체적으로',
    '뼈�� 못': '뼈도 못',
    '때문입니���': '때문입니다',
}

# Apply all replacements
changes_made = []
for old, new in replacements.items():
    count = content.count(old)
    if count > 0:
        content = content.replace(old, new)
        changes_made.append(f"'{old}' → '{new}' ({count}회)")
        print(f"✅ Fixed: {old} → {new} ({count}회)")

if changes_made:
    # Write back
    with open('c:/Users/sjm12/연습하기/data/content_db.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"\n💾 Successfully fixed {len(changes_made)} types of encoding issues!")
    
    # Check for any remaining broken characters
    remaining = len(re.findall(r'�', content))
    if remaining > 0:
        print(f"\n⚠️  Warning: {remaining} broken characters (�) still remain")
        # Show contexts
        contexts = re.findall(r'.{0,40}�.{0,40}', content)
        print("\nRemaining issues:")
        for i, ctx in enumerate(contexts[:10], 1):
            print(f"  {i}. ...{ctx}...")
    else:
        print("\n✨ No more broken characters found!")
else:
    print("✅ No encoding issues found!")
