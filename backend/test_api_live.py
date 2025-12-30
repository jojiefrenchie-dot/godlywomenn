#!/usr/bin/env python
"""Test the API endpoint directly"""

import requests
import json
import time

# Wait for server to be ready
time.sleep(2)

API_URL = "http://localhost:8000/api/ai/moderate/"

test_cases = [
    "fuck you",
    "black pussy",
    "I hate you",
    "This is wonderful"
]

print("Testing Content Moderation API")
print("=" * 70)

for text in test_cases:
    try:
        response = requests.post(
            API_URL,
            json={"text": text},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        result = response.json()
        
        print(f"\nText: '{text}'")
        print(f"Status: {response.status_code}")
        print(f"Is Toxic: {result.get('is_toxic', 'N/A')}")
        print(f"Toxicity Score: {result.get('toxicity_score', 'N/A')}")
        print(f"Recommendation: {result.get('recommendation', 'N/A')}")
        
    except Exception as e:
        print(f"\nText: '{text}'")
        print(f"ERROR: {e}")

print("\n" + "=" * 70)
print("✓ Test complete")
