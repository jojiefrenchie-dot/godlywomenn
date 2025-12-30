'use client';

import { useState } from 'react';
import CategoryForm from './CategoryForm';

export default function CategoryFormWrapper() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCategoryAdded = () => {
    // Trigger a refresh by changing the key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="hidden">
      <CategoryForm key={refreshKey} onCategoryAdded={handleCategoryAdded} />
    </div>
  );
}
