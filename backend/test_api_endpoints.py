#!/usr/bin/env python
"""
Test the AI API endpoints to verify article generation works
"""

import requests
import json
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# First, verify the functions work directly
print("=" * 70)
print("Direct Function Test")
print("=" * 70)

from ai_services import generate_article, moderate_text

# Test generation
prompt = "Divine guidance and spiritual awakening"
article = generate_article(prompt)
print(f"\n✓ Article generated ({len(article)} chars)")
print(f"Preview: {article[:150]}...")

# Test moderation
text = "This is a wonderful spiritual message"
result = moderate_text(text)
print(f"\n✓ Content moderation result:")
print(f"  - Is toxic: {result['is_toxic']}")
print(f"  - Toxicity score: {result['toxicity_score']}")
print(f"  - Recommendation: {result['recommendation']}")

print("\n" + "=" * 70)
print("API Endpoint Testing Instructions")
print("=" * 70)
print("""
To test the API endpoints, start the Django server:

1. In PowerShell, from the backend directory:
   .\.venv\Scripts\Activate.ps1
   python manage.py runserver 8000

2. Then test the endpoints:
   
   # Generate article
   curl -X POST http://localhost:8000/api/ai/generate/ \\
     -H "Content-Type: application/json" \\
     -d '{"prompt": "Faith and perseverance"}'
   
   # Moderate content
   curl -X POST http://localhost:8000/api/ai/moderate/ \\
     -H "Content-Type: application/json" \\
     -d '{"text": "This is a positive message"}'

3. Expected responses:
   - Generate: {"article": "...", "success": true}
   - Moderate: {"is_toxic": false, "toxicity_score": ..., "success": true}
""")

print("=" * 70)
print("Setup Complete!")
print("=" * 70)
