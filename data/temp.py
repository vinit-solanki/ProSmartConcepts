import json
import re
from pathlib import Path

# Six master categories, their labels, and keywords to match product types/content for smart distribution
CATEGORY_RULES = [
    {
        "name": "Medical & Healthcare",
        "id": "cat_001",
        "keywords": [
            'medical', 'diagnostic', 'medicine', 'pharma', 'pharmaceutical', 'skincare', 'vitamin', 'supplement',
            'syringe', 'consumable', 'dental', 'ear', 'oral', 'smart health', 'hot & cold', 'education', 'model',
            'safety', 'sharp', 'needle', 'sanitizer', 'hospital', 'clinic', 'analysis', 'test strip',
            'healthcare', 'biopsy', 'nebulizer', 'bp', 'blood', 'pulse', 'monitor', 'sterilizer',
            'wellness', 'cream', 'topical', 'ointment', 'dermal', 'antacid', 'drop', 'lotion', 'tablet',
            'promotional','promo', 'representative', 'medical box', 'branding', 'disposal', 'therapy','hearing',
            'analgesic','eye','diagnosis','mask','inhaler','disinfectant','scalp',
            'homeo','homeopathy','allopathy','allopathic'
        ]
    },
    {
        "name": "Beauty, Personal Care & Wellness",
        "id": "cat_002",
        "keywords": [
            'beauty', 'personal care', 'wellness', 'hair', 'skin', 'care', 'groom', 'microneedl',
            'massage', 'therapy', 'body', 'face', 'roller', 'makeup', 'cosmetic', 'aromatherapy',
            'diffuser', 'fragrance', 'perfume', 'humidifier', 'serum', 'spa', 'laser', 'patch',
            'pillow', 'hydrating', 'hydration', 'brush', 'comb', 'derma', 'sun', 'sunscreen',
        ]
    },
    {
        "name": "Home, Kitchen & Lifestyle",
        "id": "cat_003",
        "keywords": [
            'home', 'kitchen', 'storage', 'organizer', 'decor', 'clock', 'lock', 'desk',
            'lamp', 'tableware', 'mug', 'bottle', 'box', 'cleaning', 'drinkware', 'container',
            'utility', 'lighting', 'light', 'appliance', 'fragrance', 'gift', 'air freshener',
            'shoe', 'bath', 'laundry', 'infuser', 'stand', 'shelf', 'board', 'tidy',
            'spice', 'masala', 'holder', 'message board'
        ]
    },
    {
        "name": "Electronics & Gadgets",
        "id": "cat_004",
        "keywords": [
            'electronic', 'computer', 'microscope', 'portable fan', 'uv', 'digital timer',
            'doorbell', 'usb', 'fan', 'gadget', 'tech', 'device', 'timer', 'wearable',
            'wireless', 'charging', 'touch', 'sensor', 'speaker', 'bluetooth', 'smart',
            'display', 'desktop', 'remote', 'multimedia', 'aqi', 'pump', 'camera', 'monitor'
        ]
    },
    {
        "name": "Automotive, Tools & Industrial",
        "id": "cat_005",
        "keywords": [
            'automotive', 'car', 'vehicle', 'auto', 'tool', 'hardware', 'pressure washer', 
            'attachment', 'magnifying', 'industrial', 'lab', 'pump', 'mannequin', 'organizer',
            'mirror', 'torch', 'hammer', 'security', 'blade', 'powder', 'submersible', 'cutter'
        ]
    },
    {
        "name": "Kids, Education, Art & Gifts",
        "id": "cat_006",
        "keywords": [
            'stem', 'kid', 'children', 'educat', 'model', 'art', 'gift', 'toy',
            '3d print', 'learning', 'creative', 'science', 'puzzle', 'anatomy', 'glassware',
            'frame', 'themed', 'diy','school','student'
        ]
    },
]

def guess_category(product):
    fields = [
        product.get('product_name',''),
        product.get('product_title',''),
        product.get('product_description',''),
    ]
    blob = ' '.join(fields).lower()

    # First strong mapping by original categories
    strong_categ_map = {
        # Medical
        'Medical Devices': 0,
        'Healthcare': 0,
        'Medical Supplies': 0,
        'Medical Consumables': 0,
        'Medical & Diagnostics': 0,
        'Medical & Personal Care': 0,
        'Medicines & Pharma': 0,
        'Medical Education Models': 0,
        'Pharmaceuticals': 0,
        # Beauty
        'Beauty & Personal Care': 1,
        'Beauty Devices': 1,
        'Beauty Tools': 1,
        # Home etc
        'Home & Kitchen': 2,
        'Home Appliances': 2,
        'Home & Decor': 2,
        'Home & Office Utilities': 2,
        'Home Storage': 2,
        'Lighting & Portable Lamps': 2,
        'Kitchen & Home': 2,
        # Electronics
        'Electronics': 3,
        'Electronics & Gadgets': 3,
        'Electronics & Home Gadgets': 3,
        'Electronics & Wearables': 3,
        # Automotive
        'Automotive Accessories': 4,
        'Tools & Hardware': 4,
        'Tools & Electronics': 4,
        'Industrial & Lab Supplies': 4,
        # Kids/Art
        'Kids & Education': 5,
        'Gifts & Drinkware': 5,
        'Educational Aids': 5,
        '3D Printed Art & Decor': 5,
        'Toys & Education': 5,
        'Creative': 5,
    }
    if product.get('__orig_category') in strong_categ_map:
        idx = strong_categ_map[product['__orig_category']]
        return idx

    # Fuzzy: Try keyword-based assignment
    for idx, cat in enumerate(CATEGORY_RULES):
        for kw in cat['keywords']:
            if kw in blob:
                return idx
    # Otherwise, fallback miscellaneous to Medical
    return 0


def flatten_products(input_json):
    new_cat_structures = [
        {
            "category_id": cat['id'],
            "category_name": cat['name'],
            "products": [] # Flat
        } for cat in CATEGORY_RULES
    ]
    old_categories = input_json['categories']
    for orig_cat_name, cat_data in old_categories.items():
        subcats = cat_data.get('subcategories',{})
        for subcat in subcats.values():
            for p in subcat.get('products', []):
                # Remove subcategory keys, stash orig_cat for fallback classification
                p = dict(p)
                p.pop('subcategory', None)
                p.pop('subcategory_id', None)
                p['__orig_category'] = orig_cat_name
                cat_idx = guess_category(p)
                new_cat_structures[cat_idx]['products'].append(p)
    return {"categories": {
        cat['category_name']: cat for cat in new_cat_structures
    }}

if __name__ == '__main__':
    # Load input
    in_file = Path('product_final_updated.json')
    out_file = Path('product_final_sixcat.json')
    with open(in_file, encoding='utf-8') as f:
        input_json = json.load(f)
    renamed = flatten_products(input_json)
    # Remove __orig_category before saving
    for cat in renamed['categories'].values():
        for p in cat['products']:
            p.pop('__orig_category',None)
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(renamed, f, indent=2, ensure_ascii=False)
    print(f"Done! Wrote: {out_file}")