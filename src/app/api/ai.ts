/**
 * AI API Client
 * Integrates with Django backend AI endpoints
 * Uses FLAN-T5-Large and Detoxify models
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://godlywomenn.onrender.com';

/**
 * Generate an article using FLAN-T5-Large model
 * @param prompt - The topic/prompt for article generation
 * @param maxWords - Optional maximum number of words for the generated article
 * @returns Generated article text
 */
export async function generateArticle(prompt: string, maxWords?: number): Promise<string> {
  try {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    const response = await fetch(`${API_BASE_URL}/api/ai/generate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        ...(maxWords && { max_words: maxWords }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.article || 'No article generated';
  } catch (error) {
    console.error('Error generating article:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
}

/**
 * Moderate text content using Detoxify model
 * Detects toxicity, obscenity, identity attacks, insults, and threats
 * @param text - The text to moderate
 * @returns Moderation results including toxicity score and recommendation
 */
export async function moderateText(text: string): Promise<{
  is_toxic: boolean;
  toxicity_score: number;
  labels: Record<string, number>;
  recommendation: string;
}> {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    const response = await fetch(`${API_BASE_URL}/api/ai/moderate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      is_toxic: data.is_toxic || false,
      toxicity_score: data.toxicity_score || 0,
      labels: data.labels || {},
      recommendation: data.recommendation || 'Unknown',
    };
  } catch (error) {
    console.error('Error moderating text:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
}
