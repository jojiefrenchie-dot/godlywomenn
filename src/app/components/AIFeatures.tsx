'use client';

import React, { useState } from 'react';
import { generateArticle, moderateText } from '@/app/api/ai';

interface ModerationResult {
  is_toxic: boolean;
  toxicity_score: number;
  labels: Record<string, number>;
  recommendation: string;
}

const AIFeatures: React.FC = () => {
  // Article Generation State
  const [articlePrompt, setArticlePrompt] = useState('');
  const [generatedArticle, setGeneratedArticle] = useState('');
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleError, setArticleError] = useState('');

  // Content Moderation State
  const [textToModerate, setTextToModerate] = useState('');
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null);
  const [moderationLoading, setModerationLoading] = useState(false);
  const [moderationError, setModerationError] = useState('');

  // Active tab
  const [activeTab, setActiveTab] = useState<'generate' | 'moderate'>('generate');

  /**
   * Handle article generation via FLAN-T5-Large
   */
  const handleGenerateArticle = async () => {
    if (!articlePrompt.trim()) {
      setArticleError('Please enter a topic or prompt');
      return;
    }

    setArticleLoading(true);
    setArticleError('');
    setGeneratedArticle('');

    try {
      const result = await generateArticle(articlePrompt);
      setGeneratedArticle(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate article';
      setArticleError(errorMessage);
    } finally {
      setArticleLoading(false);
    }
  };

  /**
   * Handle content moderation via Detoxify
   */
  const handleModerateText = async () => {
    if (!textToModerate.trim()) {
      setModerationError('Please enter text to moderate');
      return;
    }

    setModerationLoading(true);
    setModerationError('');
    setModerationResult(null);

    try {
      const result = await moderateText(textToModerate);
      setModerationResult(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to moderate content';
      setModerationError(errorMessage);
    } finally {
      setModerationLoading(false);
    }
  };

  /**
   * Copy generated article to clipboard
   */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="my-12 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-serif font-bold text-[#dc143c] mb-6">
        AI-Powered Features
      </h2>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'generate'
              ? 'text-[#dc143c] border-b-2 border-[#dc143c]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Generate Article
        </button>
        <button
          onClick={() => setActiveTab('moderate')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'moderate'
              ? 'text-[#dc143c] border-b-2 border-[#dc143c]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Moderate Content
        </button>
      </div>

      {/* Generate Article Tab */}
      {activeTab === 'generate' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Topic or Prompt
            </label>
            <textarea
              value={articlePrompt}
              onChange={(e) => {
                setArticlePrompt(e.target.value);
                setArticleError('');
              }}
              placeholder="Enter a topic for AI-generated article (e.g., 'Faith in modern times' or 'How to overcome challenges')"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dc143c] focus:border-transparent outline-none transition-all"
              rows={4}
            />
          </div>

          <button
            onClick={handleGenerateArticle}
            disabled={articleLoading}
            className="px-6 py-2 bg-[#dc143c] text-white font-medium rounded-lg hover:bg-[#b91030] disabled:bg-gray-400 transition-colors"
          >
            {articleLoading ? 'Generating Article...' : 'Generate Article (FLAN-T5)'}
          </button>

          {/* Error Message */}
          {articleError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {articleError}
            </div>
          )}

          {/* Generated Article Result */}
          {generatedArticle && (
            <div className="space-y-3">
              <div className="p-4 bg-[#fdebd0] border border-[#f5c6a1] rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Generated Article:</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {generatedArticle}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(generatedArticle)}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      )}

      {/* Moderate Content Tab */}
      {activeTab === 'moderate' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text to Moderate
            </label>
            <textarea
              value={textToModerate}
              onChange={(e) => {
                setTextToModerate(e.target.value);
                setModerationError('');
              }}
              placeholder="Enter text to check for harmful or toxic content"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dc143c] focus:border-transparent outline-none transition-all"
              rows={4}
            />
          </div>

          <button
            onClick={handleModerateText}
            disabled={moderationLoading}
            className="px-6 py-2 bg-[#dc143c] text-white font-medium rounded-lg hover:bg-[#b91030] disabled:bg-gray-400 transition-colors"
          >
            {moderationLoading ? 'Analyzing Content...' : 'Moderate Content (Detoxify)'}
          </button>

          {/* Error Message */}
          {moderationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {moderationError}
            </div>
          )}

          {/* Moderation Results */}
          {moderationResult && (
            <div className="space-y-3">
              <div
                className={`p-4 rounded-lg border ${
                  moderationResult.is_toxic
                    ? 'bg-red-50 border-red-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-2">Moderation Results:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Status:</span>
                      <span
                        className={`font-semibold ${
                          moderationResult.is_toxic
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        {moderationResult.is_toxic ? '⚠️ Toxic' : '✓ Safe'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Toxicity Score:</span>
                      <span className="font-semibold text-gray-900">
                        {(moderationResult.toxicity_score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    <strong>Recommendation:</strong> {moderationResult.recommendation}
                  </p>
                </div>

                {/* Detailed Toxicity Labels */}
                {moderationResult.labels &&
                  Object.keys(moderationResult.labels).length > 0 && (
                    <div className="pt-3 border-t border-gray-200 mt-3">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        Detailed Analysis:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(moderationResult.labels).map(
                          ([label, score]) => (
                            <div
                              key={label}
                              className="flex justify-between p-2 bg-white rounded"
                            >
                              <span className="text-gray-600 capitalize">
                                {label.replace('_', ' ')}:
                              </span>
                              <span className="font-semibold text-gray-900">
                                {typeof score === 'number'
                                  ? (score * 100).toFixed(0) + '%'
                                  : String(score)}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">
        <p className="font-semibold text-blue-900 mb-2">ℹ️ About These Features:</p>
        <ul className="space-y-1 text-blue-800">
          <li>
            • <strong>Generate Article:</strong> Uses FLAN-T5-Large to create articles from
            prompts
          </li>
          <li>
            • <strong>Moderate Content:</strong> Uses Detoxify to detect toxicity, obscenity,
            and harmful content
          </li>
          <li>• Both models run on CPU and process requests securely</li>
        </ul>
      </div>
    </div>
  );
};

export default AIFeatures;
