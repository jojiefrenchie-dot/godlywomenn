import Link from "next/link";
import { Suspense } from "react";
import type { ArticleCategory } from "@/lib/articles";
import CategoryFormWrapper from "./CategoryFormWrapper";
import ClientOnly from "@/app/components/ClientOnly";

// Mark this route as dynamic since it fetches from a backend server
export const dynamic = 'force-dynamic';

const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';

async function getCategories(): Promise<ArticleCategory[]> {
  try {
    const res = await fetch(`${DJANGO_API}/api/categories/`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json() || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();;


  return (
    <ClientOnly>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16" suppressHydrationWarning>
        <div className="mb-8" suppressHydrationWarning>
          <h1 className="text-3xl font-serif text-[#dc143c] mb-2">Categories</h1>
          <p className="text-gray-600">
            Manage article categories to help organize content.
          </p>
        </div>

        {/* Add Category Form */}
        <Suspense>
          <CategoryFormWrapper />
        </Suspense>

        {/* Categories List */}
        <div suppressHydrationWarning>
          <h2 className="text-xl font-medium mb-4">Existing Categories</h2>
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No categories yet</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2" suppressHydrationWarning>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                  suppressHydrationWarning
                >
                  <h3 className="font-medium text-lg mb-1">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-2" suppressHydrationWarning>
                      {category.description}
                    </p>
                  )}
                  <Link
                    href={`/articles?category=${category.slug}`}
                    className="text-[#dc143c] text-sm hover:underline"
                  >
                    View articles in this category →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}