import { getCategories } from '@/lib/articles';
import Link from 'next/link';

export default async function CategoryFilter() {
  const categories = await getCategories();

  return (
    <div suppressHydrationWarning className="flex flex-wrap gap-2 mb-8">
      <Link
        href="/articles"
        suppressHydrationWarning
        className="px-4 py-2 text-sm font-medium rounded-full bg-[#dc143c] text-white hover:bg-[#dc143c]/90 transition-colors"
      >
        All Articles
      </Link>
      {categories.map((category: { id: string; name: string; slug: string }) => (
        <Link
          key={category.id}
          href={`/articles?category=${category.slug}`}
          className="px-4 py-2 text-sm font-medium rounded-full bg-[#fdebd0] text-[#dc143c] hover:bg-[#dc143c] hover:text-white transition-colors"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}