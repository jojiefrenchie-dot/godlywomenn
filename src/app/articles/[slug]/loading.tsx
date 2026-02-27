export default function Loading() {
  return (
    <div className="container py-8 animate-pulse bg-white">
      <div className="h-6 w-32 bg-[#f7cac9]/20 rounded mb-8" />
      <div className="max-w-2xl mx-auto">
        <div className="h-10 w-3/4 bg-[#f7cac9]/20 rounded mb-4" />
        <div className="h-48 bg-[#f7cac9]/20 rounded mb-8" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-[#f7cac9]/20 rounded w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}