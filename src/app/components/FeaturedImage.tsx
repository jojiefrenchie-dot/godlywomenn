'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function FeaturedImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (error) {
    return (
      <div className="aspect-w-16 aspect-h-9 mb-12 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center h-96">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Failed to load image</p>
          <p className="mt-1 text-xs text-gray-400">{src}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 rounded-lg overflow-hidden bg-gray-100 h-96 relative w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          console.error('Image failed to load:', src, e);
          setError(true);
        }}
      />
    </div>
  );
}
