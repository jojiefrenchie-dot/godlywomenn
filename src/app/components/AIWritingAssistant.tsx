import React, { useState } from 'react';

interface AIWritingAssistantProps {
  onDraftGenerated: (draft: string) => void;
}

const AIWritingAssistant: React.FC<AIWritingAssistantProps> = ({ onDraftGenerated }) => {
  const [tone, setTone] = useState('neutral');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState('');

  const handleGenerateDraft = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input, tone }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setDraft(data.draft || '');
        onDraftGenerated(data.draft || '');
      }
    } catch (error) {
      console.error('Error generating draft:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-writing-assistant">
      <h2 className="text-xl font-semibold mb-4">AI Writing Assistant</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your ideas or content..."
        className="w-full p-2 border rounded mb-4"
      />
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="neutral">Neutral</option>
        <option value="formal">Formal</option>
        <option value="friendly">Friendly</option>
        <option value="persuasive">Persuasive</option>
      </select>
      <button
        onClick={handleGenerateDraft}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? 'Generating...' : 'Generate Draft'}
      </button>
      {draft && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Generated Draft:</h3>
          <p className="p-2 border rounded bg-gray-100">{draft}</p>
        </div>
      )}
    </div>
  );
};

export default AIWritingAssistant;