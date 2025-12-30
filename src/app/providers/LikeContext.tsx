'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface LikeState {
  [articleId: string]: {
    liked: boolean;
    count: number;
  };
}

interface LikeContextType {
  likes: LikeState;
  setLike: (articleId: string, liked: boolean, count: number) => void;
  toggleLike: (articleId: string, currentLiked: boolean, currentCount: number) => { liked: boolean; count: number };
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export function LikeProvider({ children }: { children: React.ReactNode }) {
  const [likes, setLikes] = useState<LikeState>({});

  const setLike = useCallback((articleId: string, liked: boolean, count: number) => {
    setLikes((prev) => ({
      ...prev,
      [articleId]: { liked, count },
    }));
  }, []);

  const toggleLike = useCallback(
    (articleId: string, currentLiked: boolean, currentCount: number) => {
      const newLiked = !currentLiked;
      const newCount = newLiked ? currentCount + 1 : currentCount - 1;
      setLike(articleId, newLiked, newCount);
      return { liked: newLiked, count: newCount };
    },
    [setLike]
  );

  return (
    <LikeContext.Provider value={{ likes, setLike, toggleLike }}>
      {children}
    </LikeContext.Provider>
  );
}

export function useLike() {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error('useLike must be used within LikeProvider');
  }
  return context;
}
