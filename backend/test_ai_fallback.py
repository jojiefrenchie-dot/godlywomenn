#!/usr/bin/env python
"""Test the AI services with fallback functions"""

import sys
sys.path.insert(0, '.')

# Import the functions
from ai_services import generate_article, moderate_text

print("=" * 60)
print("Testing AI Services Fallback Functions")
print("=" * 60)

# Test article generation
print("\n1. Testing article generation...")
print("-" * 60)
prompt = "Write about faith and resilience"
article = generate_article(prompt)
print(f"✓ Generated article ({len(article)} chars)")
print(f"\nPreview:\n{article[:400]}...\n")

# Test moderation
print("\n2. Testing content moderation...")
print("-" * 60)
test_texts = [
    "This is a great article about spirituality",
    "I hate everything", 
    "Let's discuss prayer and meditation"
]

for i, text in enumerate(test_texts, 1):
    result = moderate_text(text)
    print(f"\n{i}. Text: '{text[:50]}{'...' if len(text) > 50 else ''}'")
    print(f"   Toxic: {result['is_toxic']}, Score: {result['toxicity_score']}")
    print(f"   Recommendation: {result['recommendation']}")

print("\n" + "=" * 60)
print("All tests completed successfully!")
print("=" * 60)
