import json
import os
from collections import OrderedDict

INSIGHTS_FILE = 'public/daily_insights.json'

def cleanup_insights():
    if not os.path.exists(INSIGHTS_FILE):
        print("File not found.")
        return

    with open(INSIGHTS_FILE, 'r', encoding='utf-8') as f:
        insights = json.load(f)

    print(f"Original count: {len(insights)}")

    # Use a dictionary to keep unique entries by slug or title
    # We prefer entries with more core_analysis sections
    unique_insights = OrderedDict()
    
    # Sort by date descending (already mostly sorted, but to be sure)
    # Actually, we want to keep the newest one if there's a conflict
    
    for item in insights:
        slug = item.get('article_info', {}).get('slug')
        title = item.get('article_info', {}).get('title')
        sections_count = len(item.get('content_body', {}).get('core_analysis', []))
        
        key = slug or title # Unique identifier
        
        if key not in unique_insights:
            unique_insights[key] = item
        else:
            existing_sections = len(unique_insights[key].get('content_body', {}).get('core_analysis', []))
            if sections_count > existing_sections:
                unique_insights[key] = item

    # Filter out very short ones (e.g. less than 3 sections) 
    # unless they are the only one for that day
    final_list = []
    seen_dates = set()
    
    # We want to maintain a "Daily" sequence.
    # If there are multiple posts on the same date, we keep the best one.
    
    sorted_items = sorted(unique_insights.values(), key=lambda x: x['article_info']['date'], reverse=True)
    
    for item in sorted_items:
        date = item['article_info']['date']
        sections_count = len(item.get('content_body', {}).get('core_analysis', []))
        
        # Heuristic: If it's a test post or very short, skip it if we have other quality posts
        if sections_count < 3 and len(final_list) > 10:
            continue
            
        # Keep only the best post per date for the recent history
        if date in seen_dates and len(seen_dates) < 30: # Limit one per day for the last month
             continue
        
        final_list.append(item)
        seen_dates.add(date)

    # Re-assign IDs to be sequential and clean
    for i, item in enumerate(reversed(final_list)):
        item['article_info']['id'] = 1000 + i

    # Final list should be newest first
    final_list = sorted(final_list, key=lambda x: x['article_info']['date'], reverse=True)

    with open(INSIGHTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, ensure_ascii=False, indent=2)
    
    print(f"Cleaned count: {len(final_list)}")

if __name__ == "__main__":
    cleanup_insights()
