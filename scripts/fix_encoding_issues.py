import re

# Read the file
with open('c:/Users/sjm12/연습하기/data/content_db.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Define all the replacements needed
replacements = {
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
    if old in content:
        content = content.replace(old, new)
        changes_made.append(f"'{old}' → '{new}'")
        print(f"✅ Fixed: {old} → {new}")

if changes_made:
    # Write back
    with open('c:/Users/sjm12/연습하기/data/content_db.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"\n💾 Successfully fixed {len(changes_made)} encoding issues!")
    
    # Check for any remaining broken characters
    remaining = re.findall(r'�', content)
    if remaining:
        print(f"\n⚠️  Warning: {len(remaining)} broken characters (�) still remain")
        # Show context
        contexts = re.findall(r'.{0,30}�.{0,30}', content)
        print("\nRemaining issues (first 5):")
        for i, ctx in enumerate(contexts[:5], 1):
            print(f"  {i}. ...{ctx}...")
    else:
        print("\n✨ No more broken characters found!")
else:
    print("✅ No encoding issues found!")
