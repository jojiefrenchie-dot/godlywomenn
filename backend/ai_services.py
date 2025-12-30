"""
AI Services Module for NLP and text analysis
"""
import re
import os
from typing import List, Dict, Any


# ==================== PRETRAINED MODEL LOADING ====================
# Load models once at module import time (not per request)

# Try to load models, but fall back gracefully if memory/dependencies unavailable
flan_t5_pipeline = None
detoxify_model = None
MODELS_LOADED = False

# Check if we should attempt to load models
SKIP_MODEL_LOADING = os.environ.get('SKIP_AI_MODELS', 'false').lower() == 'true'

if not SKIP_MODEL_LOADING:
    try:
        from transformers import pipeline
        import torch
        
        # FLAN-T5-Large for article generation
        # Uses CPU-only mode (no CUDA required)
        print("[AI Services] Attempting to load FLAN-T5-Large model...")
        flan_t5_pipeline = pipeline(
            "text2text-generation",
            model="google/flan-t5-base",  # Using base instead of large for lower memory
            device=-1,  # CPU-only mode
            model_kwargs={"low_cpu_mem_usage": True}
        )
        print("[AI Services] FLAN-T5-Base loaded successfully")
    except ImportError as e:
        print(f"[AI Services] Warning: Transformers not installed: {e}")
    except RuntimeError as e:
        print(f"[AI Services] Warning: Runtime error loading FLAN-T5: {e}")
        # Model loading might fail due to memory - this is okay, we'll use fallback
    except Exception as e:
        print(f"[AI Services] Warning: Could not load FLAN-T5-Large: {e}")

try:
    from detoxify import Detoxify
    
    # Detoxify for content moderation
    print("[AI Services] Loading Detoxify model...")
    detoxify_model = Detoxify("original", device="cpu")
    print("[AI Services] Detoxify model loaded successfully")
except ImportError as e:
    print(f"[AI Services] Warning: Detoxify not installed: {e}")
except Exception as e:
    print(f"[AI Services] Warning: Could not load Detoxify: {e}")

MODELS_LOADED = flan_t5_pipeline is not None or detoxify_model is not None

# ==================== PRETRAINED MODEL FUNCTIONS ====================


def generate_article(prompt: str, max_words: int = None) -> str:
    """
    Generate an article using FLAN-T5-Large model, or fallback to template-based generation.
    
    Args:
        prompt (str): The input prompt/topic for article generation
        max_words (int): Maximum number of words for the generated article (optional)
        
    Returns:
        str: Generated article content
        
    Example:
        >>> generate_article("Write about faith and resilience", max_words=110)
        "Faith is the foundation of..."
    """
    # Try transformer model first
    if flan_t5_pipeline is not None:
        try:
            if not prompt or len(prompt.strip()) == 0:
                return "Error: Prompt cannot be empty"
            
            # Create a structured prompt for better article generation
            if max_words and max_words <= 100:
                # Short form article (treat as character limit)
                structured_prompt = f"""Generate a short article about: {prompt}

The article should be:
- Concise and engaging
- Around {max_words} characters
- Use clear, simple language

Article:"""
                max_length = 120  # Leave room for generation
                min_length = int(max_words * 0.5) if max_words else 50
            else:
                # Full-length article
                structured_prompt = f"""Generate a comprehensive article about: {prompt}

The article should be:
- Well-structured with introduction and conclusion
- Informative and engaging
- Around 300-500 words
- Use clear paragraphs

Article:"""
                max_length = 512
                min_length = 100
            
            # Generate using FLAN-T5
            results = flan_t5_pipeline(
                structured_prompt,
                max_length=max_length,
                min_length=min_length,
                do_sample=True,
                temperature=0.7,
                top_p=0.9
            )
            
            generated_text = results[0]['generated_text']
            
            # If max_words is specified, try to trim to that length
            if max_words:
                words = generated_text.split()
                if len(words) > max_words:
                    generated_text = ' '.join(words[:max_words])
                    # Add ellipsis if we trimmed
                    if len(words) > max_words:
                        generated_text += '...'
            
            return generated_text.strip()
            
        except Exception as e:
            print(f"[AI Services] Error during FLAN-T5 generation: {e}")
            # Fall through to fallback
    
    # Fallback: template-based article generation
    return _generate_article_fallback(prompt, max_words=max_words)


def _generate_article_fallback(prompt: str, max_words: int = None) -> str:
    """
    Fallback article/comment generation using improved templates and context awareness.
    Generates natural, human-like content based on the prompt type.
    
    Args:
        prompt (str): The user's prompt (e.g., "write a comment appreciating this article")
        max_words (int): Maximum number of words for the generated article (optional)
        
    Returns:
        str: Generated content that sounds natural and human
    """
    if not prompt or len(prompt.strip()) == 0:
        return "Error: Prompt cannot be empty"
    
    # If max_words is specified and is small (<=100), generate a short article
    if max_words and max_words <= 100:
        return _generate_short_article(prompt, max_words)
    
    prompt_lower = prompt.lower()
    
    # Detect the type of content requested
    is_comment = any(word in prompt_lower for word in ['comment', 'reply', 'respond'])
    is_appreciation = any(word in prompt_lower for word in ['appreciate', 'thank', 'grateful', 'admire', 'love'])
    is_criticism = any(word in prompt_lower for word in ['criticism', 'disagree', 'concern', 'issue', 'problem', 'improve'])
    is_question = any(word in prompt_lower for word in ['question', 'ask', 'wonder', 'curious', 'how', 'why', 'what'])
    is_spiritual = any(word in prompt_lower for word in ['faith', 'prayer', 'god', 'spiritual', 'divine', 'blessed', 'amen', 'psalm', 'scripture'])
    
    # Generate appropriate response based on type
    
    if is_comment and is_appreciation:
        return _generate_appreciation_comment(prompt)
    elif is_comment and is_criticism:
        return _generate_constructive_comment(prompt)
    elif is_comment and is_question:
        return _generate_question_comment(prompt)
    elif is_comment:
        return _generate_general_comment(prompt)
    elif is_appreciation and is_spiritual:
        return _generate_spiritual_appreciation(prompt)
    elif is_appreciation:
        return _generate_appreciation_article(prompt)
    elif is_question:
        return _generate_question_article(prompt)
    elif is_spiritual:
        return _generate_spiritual_article(prompt)
    else:
        return _generate_general_article(prompt)


def _generate_short_article(prompt: str, max_words: int = 110) -> str:
    """Generate a concise article (around 110 words by default) based on title and excerpt using NLP"""
    import random
    
    # Check if this is a comment/reply request
    prompt_lower = prompt.lower()
    
    # Handle reply to comment - extract comment text
    if prompt_lower.startswith('reply to:'):
        comment_text = prompt.replace('reply to:', '').strip()
        return _generate_contextual_reply(comment_text, max_words)
    elif 'comment' in prompt_lower and 'reply' in prompt_lower and 'article' not in prompt_lower:
        # This is a reply to a comment
        return _generate_comment_reply(max_words)
    elif 'comment' in prompt_lower and 'article' in prompt_lower:
        # This is a comment on an article - pass full prompt for context
        return _generate_article_comment(prompt, max_words)
    elif 'comment' in prompt_lower:
        # Default to article comment if just "comment" - pass full prompt for context
        return _generate_article_comment(prompt, max_words)
    
    # Split title and excerpt
    parts = prompt.split('. ', 1)
    title = parts[0].strip()
    excerpt = parts[1].strip() if len(parts) > 1 else ""
    
    # Extract key concepts using simple NLP
    all_text = (excerpt or title).lower()
    words = all_text.split()
    
    # Filter meaningful words (longer than 3 chars, not common words)
    common_words = {'the', 'and', 'for', 'with', 'that', 'this', 'are', 'our', 'was', 'from', 'have', 'been', 'your', 'about', 'which', 'they', 'them', 'has', 'have', 'can', 'should', 'would', 'could', 'will', 'been', 'just', 'only', 'also', 'more', 'very', 'some', 'such', 'than', 'then', 'these', 'those'}
    key_words = [w.strip('.,!?;:') for w in words if len(w) > 3 and w.lower() not in common_words]
    
    # Remove duplicates while preserving order
    seen = set()
    key_concepts = []
    for word in key_words[:5]:
        if word not in seen:
            key_concepts.append(word)
            seen.add(word)
    
    # Generate contextual opening based on excerpt or title sentiment
    topic = excerpt if excerpt else title
    
    # Detect topic type for better context generation
    is_spiritual = any(word in topic.lower() for word in ['faith', 'prayer', 'god', 'spiritual', 'divine', 'blessed', 'hope', 'soul', 'grace'])
    is_personal = any(word in topic.lower() for word in ['journey', 'story', 'experience', 'lesson', 'growth', 'change', 'life'])
    is_emotional = any(word in topic.lower() for word in ['love', 'joy', 'pain', 'struggle', 'strength', 'courage', 'heart', 'feeling'])
    
    # Generate context-aware content
    if is_spiritual:
        articles = [
            f"This journey connects us to something greater. Through reflection and faith, we discover paths that guide us forward. Every step matters. Trust the process and embrace what unfolds.",
            f"There's profound wisdom in what we experience. By staying open and present, we find meaning in life's moments. This deepens our understanding and strengthens our resolve.",
            f"Life teaches us through every chapter. The challenges we face become opportunities for growth. What matters most is how we respond with grace and authenticity.",
        ]
    elif is_emotional:
        articles = [
            f"Our deepest feelings often point to what matters most. Acknowledging them brings clarity and connection. Share your truth and inspire others to do the same.",
            f"Every emotion is valid and valuable. They guide us toward understanding ourselves better. By embracing them fully, we grow stronger and more resilient.",
            f"The heart knows truths the mind is still learning. Listen to what it's telling you. Your authentic self is your greatest strength.",
        ]
    elif is_personal:
        articles = [
            f"Each experience shapes who we become. Looking back, we see patterns of growth and resilience. What we learn becomes wisdom we can share with others.",
            f"Our stories matter. They inspire, teach, and connect us. By sharing our journey, we give others permission to embrace their own path.",
            f"Growth happens when we stay true to ourselves. Each step forward, intentional or not, leads us somewhere meaningful.",
        ]
    else:
        articles = [
            f"Understanding the world around us helps us make better choices. What we learn influences how we connect with others and grow ourselves.",
            f"Every perspective adds depth to our collective wisdom. By staying curious and open, we discover new ways of thinking and being.",
            f"The more we learn about this, the better equipped we are. Knowledge becomes power when we use it with intention and compassion.",
        ]
    
    return random.choice(articles)


def _generate_comment_reply(max_words: int = 50) -> str:
    """Generate a short comment or reply (around 50 words)"""
    import random
    
    replies = [
        "This resonates deeply with me. Thank you for sharing such an authentic perspective.",
        "What a beautiful way to express this. I find myself nodding along to every word.",
        "This touched my heart. Your honesty and vulnerability are truly inspiring.",
        "Such wisdom here. You've captured something really important that many need to hear.",
        "I really appreciate this insight. It's given me something valuable to think about.",
        "Beautifully said. Your words have a way of clarifying what I've been feeling.",
        "This is exactly what I needed to read today. Thank you for sharing.",
        "What a powerful message. You have a gift for expressing truth with such grace.",
        "Your perspective is refreshing and meaningful. This genuinely made my day better.",
        "I'm grateful for this. Your authenticity is a reminder of what really matters.",
    ]
    
    return random.choice(replies)


def _generate_contextual_reply(comment_text: str, max_words: int = 50) -> str:
    """Generate a contextual reply to a specific comment - can be 1 word to 50 words"""
    import random
    
    # Analyze the comment
    comment_lower = comment_text.lower().strip()
    
    # Very short/simple greetings and one-word comments
    if len(comment_lower) < 5:
        greeting_responses = [
            "Hey!",
            "Hi there!",
            "Hello!",
            "Good to see you!",
            "Thanks for sharing!",
            "Appreciate it!",
            "Thanks!",
            "Nice!",
            "Cool!",
            "Right on!",
        ]
        return random.choice(greeting_responses)
    
    # Very short comments (5-10 chars) - acknowledge briefly
    if len(comment_lower) < 10:
        short_responses = [
            "Thanks for that!",
            "Great!",
            "I agree!",
            "Absolutely!",
            "Well said!",
            "Exactly!",
            "Indeed!",
            "Couldn't agree more.",
            "100%",
            "Yes!",
        ]
        return random.choice(short_responses)
    
    # Detect comment sentiment/content
    is_positive = any(word in comment_lower for word in ['love', 'great', 'beautiful', 'amazing', 'wonderful', 'appreciate', 'grateful', 'thank', 'good'])
    is_question = '?' in comment_text
    is_critical = any(word in comment_lower for word in ['disagree', 'but', 'however', 'concern', 'problem', 'issue'])
    
    # Generate contextual responses
    if is_question:
        question_responses = [
            "Great question!",
            "That's an interesting question. I think it depends on perspective.",
            "Good point to explore. My take is that it varies from person to person.",
            "Love that you're asking this. There's definitely room for multiple perspectives.",
            "That's worth thinking about. Context matters a lot here.",
        ]
        return random.choice(question_responses)
    
    if is_critical:
        critical_responses = [
            "I see your point.",
            "That's a fair perspective. There's another angle worth considering too.",
            "Good observation. Both viewpoints have merit.",
            "I appreciate you bringing that up. Valid concern.",
            "Interesting take. There's nuance here.",
        ]
        return random.choice(critical_responses)
    
    if is_positive:
        positive_responses = [
            "Absolutely! You've captured something real.",
            "Love your perspective on this.",
            "Yes! You've touched on something important.",
            "Perfect take.",
            "Couldn't have said it better.",
        ]
        return random.choice(positive_responses)
    
    # Default thoughtful responses
    default_responses = [
        "Great contribution!",
        "Thanks for sharing that perspective.",
        "Well put.",
        "That's a good point.",
        "I appreciate this insight.",
    ]
    return random.choice(default_responses)



def _generate_article_comment(prompt: str = "", max_words: int = 50) -> str:
    """Generate a simple comment responding to an article (around 50 words).
    
    Uses template-based generation without AI.
    
    Args:
        prompt: The prompt (unused, kept for compatibility)
        max_words: Maximum words for the comment
    
    Returns:
        A simple appreciative comment
    """
    import random
    
    # Simple template comments
    comments = [
        "This article really speaks to me. The insights here have given me much to reflect on.",
        "Thank you for sharing this perspective. It's a refreshing take that made me see things differently.",
        "Beautifully written. Your words capture something essential that resonates deeply.",
        "I found this truly valuable. The wisdom here is something I'll be thinking about.",
        "What an important piece. This touched my heart and reminded me of what really matters.",
        "Your voice matters and this message is powerful. Thank you for sharing.",
        "This is exactly what the world needs to hear. Powerful and meaningful work.",
        "I'm grateful for articles like this. They inspire reflection and growth.",
        "Truly inspiring and thought-provoking. You've articulated something beautiful.",
        "This resonates on so many levels. Your authenticity is truly appreciated.",
    ]
    
    return random.choice(comments)


def _generate_appreciation_comment(prompt: str) -> str:
    """Generate a warm, genuine appreciation comment"""
    openings = [
        "This is truly beautiful!",
        "I really appreciate this perspective.",
        "Thank you for sharing this.",
        "This resonates so deeply with me.",
        "What a wonderful insight!",
        "I'm so grateful for this.",
        "This touched my heart.",
        "Beautifully expressed!",
    ]
    
    middles = [
        "The way you've shared this shows real depth and thoughtfulness.",
        "Your words carry so much meaning and authenticity.",
        "This is exactly what I needed to hear today.",
        "The sincerity in your message is truly inspiring.",
        "You've captured something really important here.",
        "This perspective is both refreshing and meaningful.",
        "Your vulnerability and honesty are so valuable.",
    ]
    
    closings = [
        "Thank you for brightening my day.",
        "This will stay with me for a long time.",
        "Keep sharing these gems!",
        "Your contribution means so much.",
        "Blessings to you for this wisdom.",
        "This is exactly the kind of message the world needs.",
        "Truly grateful for you taking the time to share this.",
    ]
    
    import random
    return f"{random.choice(openings)} {random.choice(middles)} {random.choice(closings)}"


def _generate_constructive_comment(prompt: str) -> str:
    """Generate thoughtful, constructive feedback"""
    return """I really value this perspective, and I'd like to offer a thought to consider. 

While I agree with the overall sentiment, I think there might be additional context worth exploring. What if we also looked at this from [alternative perspective]? 

I find that this angle could help us understand the fuller picture. That said, your core point is absolutely valid and important.

Looking forward to discussing this further!"""


def _generate_question_comment(prompt: str) -> str:
    """Generate an engaging question comment"""
    return """This is fascinating! I have a question that came to mind while reading this:

What do you think about [related aspect]? I'm curious how your perspective extends to that area.

Also, I'd love to know if you've experienced [related situation]. Your insights have been so valuable that I'd genuinely like to understand your thoughts on this too.

Thanks for encouraging this kind of thoughtful discussion!"""


def _generate_general_comment(prompt: str) -> str:
    """Generate a natural, engaging comment"""
    return """This is really well put. I found myself nodding along as I read.

The way you've framed this is both clear and compelling. It's refreshing to see someone break this down so thoughtfully. 

I've been thinking about this topic lately, and your perspective has given me something new to consider. Thanks for sharing your wisdom here. Discussions like this are what make this community so special."""


def _generate_appreciation_article(prompt: str) -> str:
    """Generate an article expressing appreciation"""
    return """The Power of Gratitude and Appreciation

In a world that often rushes past moments of goodness, taking time to truly appreciate what we have becomes an act of profound wisdom.

Appreciation is more than just saying thank you—it's about recognizing the value in people, experiences, and moments that shape our lives. When we practice genuine gratitude, we shift our perspective. Suddenly, we see not what's missing, but what's already beautiful.

The Impact of Speaking Our Appreciation

Have you ever noticed how a simple word of genuine appreciation can change someone's day? When we tell someone what their work, kindness, or presence means to us, we're doing more than complimenting them—we're affirming their worth.

In relationships, in work, in community—appreciation is the glue that holds things together. It's the reminder that we see each other, that we value each other, that we matter to one another.

Why Appreciation Matters Now

In times of challenge, appreciation becomes even more powerful. It helps us maintain perspective, strengthens our connections with others, and reminds us of what truly matters.

Taking a moment each day to appreciate something—a person, a skill, an opportunity, a simple pleasure—can transform how we experience our lives.

So today, I encourage you: appreciate someone. Notice what you're grateful for. Let the people around you know that they matter.

Because in the end, a life lived with appreciation is a life truly lived."""


def _generate_question_article(prompt: str) -> str:
    """Generate an article exploring questions"""
    return """Exploring Deep Questions

The best journeys often begin with a question. Not just any question, but the kind that makes us pause, think, and reconsider what we know.

Questions are invitations. They invite us to explore, to discover, to go deeper into understanding ourselves and our world. When we're willing to sit with a good question—really sit with it—we often find that the answer was less important than what the questioning taught us.

The Value of Curiosity

A questioning mind is an open mind. It's willing to learn, to be wrong, to grow. In spiritual traditions and in science alike, the questions we ask shape the discoveries we make.

What questions are you sitting with right now? What mysteries call to you? What would you like to understand more deeply?

The Journey of Discovery

Sometimes answers don't come immediately. Sometimes a question stays with us, quietly working in the background, until we're ready to understand. And that's okay. That's actually where the real growth happens.

So embrace your questions. Let them guide you. Share them with others who might be wondering the same things. In the space between question and answer, something beautiful often emerges."""


def _generate_spiritual_appreciation(prompt: str) -> str:
    """Generate a spiritually-focused appreciation message"""
    return """I am deeply grateful for this message and the spiritual wisdom it carries.

The way you've connected these truths is truly beautiful. Your words remind me of what matters most—our faith, our connection to the divine, and our commitment to living with grace and purpose.

This perspective is a blessing. Thank you for sharing your spiritual insight with such authenticity and heart. Messages like this nourish the soul and strengthen our faith journey.

May blessings continue to flow in your life."""


def _generate_spiritual_article(prompt: str) -> str:
    """Generate spiritually-focused content"""
    return """A Path of Faith and Reflection

In the quiet moments, we often find what truly matters. Faith, in its deepest form, is not about having all the answers—it's about trusting the journey, even when the path isn't clear.

Finding Peace in Uncertainty

Life brings us seasons of certainty and seasons of doubt. Both are valuable. Both teach us something about ourselves and about faith. In the moments when we feel most lost, we often discover new strength.

The Power of Connection

Whether through prayer, meditation, community, or quiet reflection, our spiritual practices ground us. They remind us that we're part of something larger than ourselves. They connect us to others who are on similar journeys.

Living with Purpose

When we align our daily lives with what we truly believe in, everything changes. Our actions become more meaningful. Our relationships deepen. Our sense of purpose becomes clear.

Whatever your faith tradition, whatever your spiritual path, the invitation is the same: to live authentically, to treat others with compassion, and to remember that we're all walking this journey together.

May you find peace, purpose, and profound connection on your path."""


def _generate_general_article(prompt: str) -> str:
    """Generate a well-rounded, engaging article"""
    # Extract key topics from the prompt
    key_words = [word for word in prompt.lower().split() if len(word) > 4]
    topic = prompt[:80] if len(prompt) < 80 else prompt[:80] + "..."
    
    return f"""Exploring {topic}

Understanding the Deeper Meaning

When we look at this topic closely, we discover layers of meaning that aren't immediately obvious. There's a richness to exploring what matters most to us, and how we engage with the world around us.

Why This Matters

The things we choose to focus on shape our lives. They influence how we interact with others, how we make decisions, and ultimately, who we become. That's why thoughtful reflection on important topics is so valuable.

Practical Insights

As we navigate this subject, we might consider:
- How does this connect to what matters most in my life?
- What have others learned from similar experiences?
- How can I apply this wisdom in meaningful ways?
- Who else might benefit from this perspective?

Moving Forward

The journey of understanding is ongoing. Each conversation, each reflection, each new perspective adds to our comprehension. And that's exactly as it should be.

The most important step is simply to keep exploring, keep questioning, and keep growing. Whatever this topic means to you, trust that your engagement with it is part of your unique path forward."""


def moderate_text(text: str) -> dict:
    """
    Moderate text content using Detoxify model, or fallback to simple keyword-based detection.
    Detects toxicity, obscenity, identity attack, insult, and threat.
    
    Args:
        text (str): The text to moderate
        
    Returns:
        dict: Dictionary containing toxicity scores and flags
        
    Example:
        >>> moderate_text("This is a harmful comment")
        {
            'is_toxic': True,
            'toxicity_score': 0.95,
            'labels': {...},
            'recommendation': 'Block this content'
        }
    """
    # Try Detoxify model first
    if detoxify_model is not None:
        try:
            if not text or len(text.strip()) == 0:
                return {
                    "is_toxic": False,
                    "toxicity_score": 0,
                    "labels": {},
                    "recommendation": "No content to moderate",
                }
            
            # Get predictions from Detoxify
            predictions = detoxify_model.predict(text)
            
            # Extract overall toxicity score
            toxicity_score = predictions.get('toxicity', 0)
            
            # Determine if content is toxic (threshold: 0.5)
            is_toxic = toxicity_score > 0.5
            
            # Generate recommendation
            if is_toxic:
                recommendation = "Content flagged as potentially toxic - consider review or rejection"
            else:
                recommendation = "Content appears safe"
            
            return {
                "is_toxic": is_toxic,
                "toxicity_score": round(toxicity_score, 3),
                "labels": predictions,
                "recommendation": recommendation,
            }
        except Exception as e:
            print(f"[AI Services] Error during Detoxify moderation: {e}")
            # Fall through to fallback
    
    # Fallback: keyword-based moderation
    return _moderate_text_fallback(text)


def _moderate_text_fallback(text: str) -> dict:
    """
    Fallback content moderation using keyword detection when models are unavailable.
    
    Args:
        text (str): The text to moderate
        
    Returns:
        dict: Moderation results with toxicity assessment
    """
    if not text or len(text.strip()) == 0:
        return {
            "is_toxic": False,
            "toxicity_score": 0,
            "labels": {},
            "recommendation": "No content to moderate",
        }
    
    # Simple keyword-based detection
    toxic_keywords = {
        'hate', 'kill', 'death', 'violence', 'abuse', 'curse', 'damn', 
        'hell', 'evil', 'attack', 'threat', 'harm', 'discrimin'
    }
    
    text_lower = text.lower()
    found_toxic = [kw for kw in toxic_keywords if kw in text_lower]
    
    # Calculate a simple toxicity score based on found keywords
    toxicity_score = min(len(found_toxic) * 0.2, 1.0)
    is_toxic = toxicity_score > 0.3
    
    if is_toxic:
        recommendation = f"Content may contain inappropriate language ({len(found_toxic)} potential issues). Review recommended."
    else:
        recommendation = "Content appears safe"
    
    return {
        "is_toxic": is_toxic,
        "toxicity_score": round(toxicity_score, 3),
        "labels": {
            "detected_keywords": found_toxic,
            "method": "keyword_based_fallback"
        },
        "recommendation": recommendation,
    }


# ==================== EXISTING TEXT ANALYSIS CLASSES ====================



class TextAnalyzer:
    """Analyzes text for sentiment, keywords, and suggestions"""
    
    @staticmethod
    def extract_keywords(text: str, max_keywords: int = 5) -> List[str]:
        """Extract keywords from text"""
        # Remove common stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being'}
        
        # Split text and filter
        words = re.findall(r'\b\w+\b', text.lower())
        keywords = [w for w in words if w not in stop_words and len(w) > 3]
        
        # Count frequency and return top keywords
        from collections import Counter
        word_freq = Counter(keywords)
        return [word for word, _ in word_freq.most_common(max_keywords)]
    
    @staticmethod
    def suggest_title_improvements(title: str) -> List[str]:
        """Suggest improvements for a title"""
        suggestions = []
        
        # Check length
        if len(title) < 10:
            suggestions.append("Title is too short. Consider adding more descriptive words.")
        elif len(title) > 100:
            suggestions.append("Title is quite long. Consider making it more concise.")
        
        # Check if it starts with a capital letter
        if title and not title[0].isupper():
            suggestions.append("Consider starting your title with a capital letter.")
        
        # Check for action words
        action_words = ['discover', 'learn', 'explore', 'understand', 'master', 'unveil', 'reveal']
        if not any(word in title.lower() for word in action_words):
            suggestions.append("Consider using an action word like 'Discover', 'Learn', or 'Explore'.")
        
        return suggestions if suggestions else ["Your title looks good!"]
    
    @staticmethod
    def suggest_excerpt_improvements(excerpt: str) -> List[str]:
        """Suggest improvements for an excerpt"""
        suggestions = []
        
        # Check length
        if len(excerpt) < 50:
            suggestions.append("Excerpt is too short. Aim for 50-150 characters.")
        elif len(excerpt) > 200:
            suggestions.append("Excerpt is quite long. Consider keeping it under 200 characters.")
        
        # Check if it ends with punctuation
        if excerpt and excerpt[-1] not in '.!?':
            suggestions.append("Consider ending your excerpt with proper punctuation.")
        
        # Check for engagement
        if '?' not in excerpt and '!' not in excerpt:
            suggestions.append("Consider using a question or exclamation to engage readers.")
        
        return suggestions if suggestions else ["Your excerpt looks good!"]


class CategoryTagger:
    """Tags content with relevant categories"""
    
    # Predefined category keywords
    CATEGORY_KEYWORDS = {
        'bible-verse': ['scripture', 'verse', 'psalm', 'proverb', 'gospel', 'testament', 'chapter', 'john', 'matthew', 'mark', 'luke'],
        'prayer': ['prayer', 'pray', 'intercession', 'petition', 'supplication', 'blessed', 'amen', 'faith'],
        'devotional': ['devotion', 'daily', 'reflection', 'contemplation', 'meditate', 'spiritual', 'soul'],
        'testimony': ['testimony', 'experience', 'story', 'journey', 'personal', 'life', 'transformation', 'miracle'],
        'song-psalms': ['song', 'psalm', 'hymn', 'music', 'praise', 'worship', 'melody', 'tune'],
        'personal-observation': ['observation', 'reflection', 'thought', 'insight', 'perspective', 'view', 'opinion'],
    }
    
    @classmethod
    def suggest_categories(cls, content: str, max_suggestions: int = 3) -> List[str]:
        """Suggest categories based on content"""
        content_lower = content.lower()
        scores = {}
        
        for category, keywords in cls.CATEGORY_KEYWORDS.items():
            # Count keyword matches
            score = sum(1 for keyword in keywords if keyword in content_lower)
            if score > 0:
                scores[category] = score
        
        # Return top suggestions
        sorted_categories = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return [cat for cat, _ in sorted_categories[:max_suggestions]]


class DraftGenerator:
    """Generates content based on tone and input"""
    
    TONE_TEMPLATES = {
        'neutral': "Here's a thoughtful perspective on {topic}: ",
        'formal': "The matter concerning {topic} warrants careful consideration. ",
        'friendly': "I'd like to share something about {topic} that might interest you. ",
        'persuasive': "You should really think about {topic} because it matters greatly. ",
    }
    
    @classmethod
    def generate_draft(cls, content: str, tone: str = 'neutral') -> str:
        """Generate a draft with given tone"""
        # Extract main topic
        words = content.split()
        topic = ' '.join(words[:min(3, len(words))]) if words else 'this topic'
        
        template = cls.TONE_TEMPLATES.get(tone, cls.TONE_TEMPLATES['neutral'])
        intro = template.format(topic=topic)
        
        # Create a simple draft
        draft = intro + content
        return draft


# Export the main classes
__all__ = ['TextAnalyzer', 'CategoryTagger', 'DraftGenerator']
