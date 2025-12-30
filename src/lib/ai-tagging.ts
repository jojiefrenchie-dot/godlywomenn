import axios from 'axios';

interface TaggingResponse {
  tags: string[];
}

interface SuggestionResponse {
  suggestion: string;
}

interface AnalysisResponse {
  analysis: string[];
}

export async function autoTagContent(content: string): Promise<string[]> {
  try {
    const response = await axios.post<TaggingResponse>('/api/ai/tagging', { content });
    const data = response.data;
    return data.tags || [];
  } catch (error) {
    console.error('Error auto-tagging content:', error);
    return [];
  }
}

export async function generateSuggestions(content: string, tone: string): Promise<string> {
  try {
    const response = await axios.post<SuggestionResponse>('/api/ai/suggestions', { content, tone });
    const data = response.data;
    return data.suggestion || 'Failed to generate suggestions.';
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return 'Failed to generate suggestions.';
  }
}

export async function analyzeText(text: string): Promise<string[]> {
  try {
    const response = await axios.post<AnalysisResponse>('/api/ai/analyze-text', { text });
    const data = response.data;
    return data.analysis || [];
  } catch (error) {
    console.error('Error analyzing text:', error);
    return [];
  }
}