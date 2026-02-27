# AI Model Loading Fix - November 26, 2025

## Issue
The article generation was returning: "Article generation unavailable. Model not loaded."

## Root Cause
The FLAN-T5-Large and Detoxify models were failing to load silently due to:
1. Missing dependencies in the virtual environment
2. Model loading errors not being properly handled
3. No fallback mechanism when models failed to load

## Solution Implemented

### 1. **Updated `ai_services.py`**
   - Added proper error handling with fallback mechanisms
   - Changed from FLAN-T5-Large to FLAN-T5-Base (lower memory footprint)
   - Added low memory usage mode: `model_kwargs={"low_cpu_mem_usage": True}`
   - Implemented fallback functions:
     - `_generate_article_fallback()`: Template-based article generation
     - `_moderate_text_fallback()`: Keyword-based content moderation

### 2. **Dependencies Installed**
   ```
   Django>=4.2
   djangorestframework
   djangorestframework-simplejwt
   django-cors-headers
   transformers
   torch
   detoxify
   ```

### 3. **Model Status After Fix**
   ✅ **FLAN-T5-Base** - Successfully loaded on CPU
   ✅ **Detoxify Model** - Successfully loaded on CPU
   ✅ **Fallback Functions** - Ready if models fail in the future

## Testing
Verified both models are working:
- Article generation now produces actual AI-generated content
- Content moderation correctly identifies toxic language
- Fallback functions available as safety net

## API Endpoints Status

### POST `/api/ai/generate/`
**Status**: ✅ Working
- Generates articles using FLAN-T5-Base
- Falls back to template generation if needed

### POST `/api/ai/moderate/`
**Status**: ✅ Working
- Detects toxic content using Detoxify model
- Falls back to keyword-based detection if needed

## Environment Variables (Optional)
Set `SKIP_AI_MODELS=true` to disable model loading and use fallback functions only:
```bash
set SKIP_AI_MODELS=true
```

## Performance Notes
- FLAN-T5-Base uses ~1GB RAM (vs 3GB for Large)
- CPU-only mode (no GPU required)
- First load may take time as models download from HuggingFace Hub
- Models are cached in `~/.cache/torch/hub/` and `~/.cache/huggingface_hub/`

## Files Modified
- `backend/ai_services.py` - Added proper error handling and fallback functions
- `backend/test_ai_fallback.py` - Test script to verify functionality
