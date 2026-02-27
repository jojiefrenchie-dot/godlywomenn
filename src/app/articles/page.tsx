import { Suspense } from 'react';
import { getArticles } from '@/lib/articles';
import ArticleCard from '@/app/components/ArticleCard';
import type { Article } from '@/lib/articles';
import CategoryFilter from '@/app/components/CategoryFilter';
import Link from 'next/link';
import RequireLoginButton from '@/app/components/RequireLoginButton';

async function ArticleList({
  category,
  search,
  page = 1,
  includeAll = false
}: {
  category?: string;
  search?: string;
  page?: number;
  includeAll?: boolean;
}) {
  const { articles, totalPages } = await getArticles({
    category,
    search,
    page,
    includeAll,
  });

        if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
        <p className="mt-2 text-sm text-gray-600">
          {category 
            ? "No articles found in this category. Try selecting a different category."
            : search
            ? "No articles match your search criteria. Try different keywords."
            : "No articles have been published yet. Be the first to share your story!"}
        </p>
              <RequireLoginButton
                href="/articles/create"
                className="inline-block mt-4 px-4 py-2 bg-[#dc143c] text-white rounded-md hover:bg-[#dc143c]/90 transition-colors"
              >
                Write an Article
              </RequireLoginButton>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="space-y-8">
      {search && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-8 border-2 border-[#dc143c]">
          <h2 className="text-2xl font-serif text-[#dc143c] mb-2">
            Search Results
          </h2>
          <p className="text-gray-600">
            Found {articles.length} article{articles.length !== 1 ? 's' : ''} matching &quot;{search}&quot;
          </p>
        </div>
      )}
      <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: Article) => (
          <ArticleCard 
            key={article.id} 
            article={article}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <Link
              key={num}
              href={{
                pathname: '/articles',
                query: { ...(category && { category }), ...(search && { search }), page: num },
              }}
              className={`px-4 py-2 text-sm font-medium rounded ${
                num === page
                  ? 'bg-[#dc143c] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {num}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = params.category?.toString();
  const search = params.search?.toString();
  const page = params.page ? parseInt(params.page.toString()) : 1;
  
  // Only include all articles when viewing own profile
  const includeAll = false;

  return (
    <div suppressHydrationWarning className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div suppressHydrationWarning className="text-center mb-16">
        <h1 suppressHydrationWarning className="text-5xl font-serif mb-4 text-[#dc143c]">
          Godly women in business
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Inspiring narratives of faith, courage, and unwavering dedication to God&apos;s calling.
        </p>
      </div>

      <div suppressHydrationWarning className="space-y-8">
        <div suppressHydrationWarning className="flex justify-between items-center">
          <form suppressHydrationWarning className="max-w-md flex-1">
            <div suppressHydrationWarning className="relative">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search articles..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#dc143c] focus:border-[#dc143c]"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          <RequireLoginButton
            href="/articles/create"
            className="ml-4 px-4 py-2 bg-[#dc143c] text-white rounded-md hover:bg-[#dc143c]/90 transition-colors flex items-center gap-2"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Write Article
          </RequireLoginButton>
        </div>
        
        <Suspense fallback={
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        }>
          <CategoryFilter />
        </Suspense>
      </div>



      <Suspense
        fallback={
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dc143c] mx-auto"></div>
          </div>
        }
      >
        <ArticleList 
          category={category} 
          search={search} 
          page={page} 
          includeAll={includeAll}
        />
      </Suspense>
    </div>
  );
}