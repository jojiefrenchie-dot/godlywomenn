import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Recommendation {
  id: string;
  title: string;
  slug: string;
}

interface RecommendationEngineProps {
  articleId: string;
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({ articleId }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ recommendations: Recommendation[] }>(`/api/ai/recommendations?articleId=${articleId}`);
        setRecommendations(response.data.recommendations || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [articleId]);

  return (
    <div className="recommendation-engine">
      <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
      {loading ? (
        <p>Loading recommendations...</p>
      ) : (
        <ul className="space-y-2">
          {recommendations.map((rec) => (
            <li key={rec.id}>
              <a
                href={`/articles/${rec.slug}`}
                className="text-blue-500 hover:underline"
              >
                {rec.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecommendationEngine;