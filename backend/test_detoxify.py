#!/usr/bin/env python
"""Test if Detoxify is actually being used"""

import sys
sys.path.insert(0, '.')

from ai_services import detoxify_model, moderate_text

print("=" * 60)
print("Testing Detoxify Model Status")
print("=" * 60)

print(f"\nDetoxify model loaded: {detoxify_model is not None}")

if detoxify_model is not None:
    print("\n✓ Detoxify model IS loaded")
    print("\nTesting direct model prediction...")
    
    test_texts = [
        "black pussy",
        "I hate you",
        "This is wonderful"
    ]
    
    for text in test_texts:
        result = detoxify_model.predict(text)
        print(f"\nText: '{text}'")
        print(f"Raw result: {result}")
        print(f"Toxicity: {result.get('toxicity', 0)}")
else:
    print("\n✗ Detoxify model NOT loaded - using fallback!")

print("\n" + "=" * 60)
print("Testing moderate_text() function")
print("=" * 60)

test_texts = [
    "black pussy",
    "I hate everything",
    "This is great"
]

for text in test_texts:
    result = moderate_text(text)
    print(f"\nText: '{text}'")
    print(f"  Is toxic: {result['is_toxic']}")
    print(f"  Score: {result['toxicity_score']}")
    print(f"  Method: {result.get('labels', {}).get('method', 'detoxify')}")
    print(f"  Recommendation: {result['recommendation']}")
