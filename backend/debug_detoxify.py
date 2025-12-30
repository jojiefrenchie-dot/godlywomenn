#!/usr/bin/env python
"""Debug why Detoxify is not working"""

import sys
sys.path.insert(0, '.')

print("Step 1: Check if detoxify can be imported")
try:
    from detoxify import Detoxify
    print("✓ Detoxify imported successfully")
except ImportError as e:
    print(f"✗ Failed to import Detoxify: {e}")
    sys.exit(1)

print("\nStep 2: Load Detoxify model directly")
try:
    model = Detoxify('original', device='cpu')
    print("✓ Detoxify model loaded")
except Exception as e:
    print(f"✗ Failed to load model: {e}")
    sys.exit(1)

print("\nStep 3: Test with problematic text")
test_texts = [
    "fuck you",
    "I hate you", 
    "This is nice"
]

for text in test_texts:
    result = model.predict(text)
    print(f"\nText: '{text}'")
    print(f"  Toxicity: {result.get('toxicity', 0):.4f}")
    print(f"  Full result: {result}")

print("\n" + "="*60)
print("Step 4: Check ai_services.py detoxify_model")
print("="*60)

from ai_services import detoxify_model

if detoxify_model is not None:
    print("✓ detoxify_model is loaded")
    
    # Test with the model from ai_services
    for text in test_texts:
        result = detoxify_model.predict(text)
        print(f"\nText: '{text}'")
        print(f"  Toxicity: {result.get('toxicity', 0):.4f}")
else:
    print("✗ detoxify_model is None (not loaded!)")

print("\n" + "="*60)
print("Step 5: Test the moderate_text function")
print("="*60)

from ai_services import moderate_text

for text in test_texts:
    result = moderate_text(text)
    print(f"\nText: '{text}'")
    print(f"  Is toxic: {result['is_toxic']}")
    print(f"  Score: {result['toxicity_score']}")
    print(f"  Method: {result.get('labels', {}).get('method', 'detoxify')}")
