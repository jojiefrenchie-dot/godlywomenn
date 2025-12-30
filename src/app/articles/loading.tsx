export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section Skeleton */}
      <div className="text-center mb-16">
        <div className="h-12 w-96 bg-gray-100 rounded animate-pulse mx-auto mb-4" />
        <div className="h-6 w-2/3 bg-gray-100 rounded animate-pulse mx-auto" />
      </div>

      {/* Articles Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {/* Image placeholder */}
            <div className="aspect-w-16 aspect-h-9 mb-6 rounded-lg bg-gray-100 animate-pulse" />
            
            {/* Title placeholder */}
            <div className="h-7 bg-gray-100 rounded animate-pulse mb-3 w-3/4" />
            
            {/* Excerpt placeholder */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-4/5" />
            </div>
            
            {/* Read more placeholder */}
            <div className="h-5 bg-gray-100 rounded animate-pulse w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}