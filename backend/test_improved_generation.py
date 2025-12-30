#!/usr/bin/env python
"""Test the improved article/comment generation"""

import sys
sys.path.insert(0, '.')

from ai_services import generate_article

test_prompts = [
    "write an appreciation comment",
    "write a constructive criticism comment",
    "ask a thoughtful question",
    "write an article about faith",
    "write about gratitude",
]

print("=" * 70)
print("Testing Improved Article/Comment Generation")
print("=" * 70)

for prompt in test_prompts:
    print(f"\n📝 Prompt: '{prompt}'")
    print("-" * 70)
    result = generate_article(prompt)
    print(result)
    print("-" * 70)

print("\n✓ All tests complete!")
