import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { notFound, redirect } from "next/navigation";
import { getArticleBySlug } from "@/lib/articles";
import type { ArticleTag } from "@/lib/articles";
import ArticleActions from "@/app/components/ArticleActions";
import ArticleComments from "@/app/components/ArticleComments";
import FeaturedImage from "@/app/components/FeaturedImage";

const DJANGO_API = 'https://godlywomenn.onrender.com';

function buildAbsoluteUrl(base: string, path: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  // For media files, use Next.js proxy endpoint
  if (path.startsWith('/media/')) {
    const mediaPath = path.replace(/^\/media\//, '');
    return `/api/media/${mediaPath}`;
  }
  const b = String(base || '').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : '/' + path;
  return b + p;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await params in Next.js 15
  const { slug } = await params;

  // If the slug matches the literal 'create', redirect to the create page
  // This prevents the dynamic article page from trying to fetch an article with slug "create"
  if (slug === 'create') {
    redirect('/articles/create');
  }

  try {
    // Get the article data
    const article = await getArticleBySlug(slug);

    if (!article) {
      notFound();
    }

    // Construct full featured_image URL on the server
    let fullFeaturedImageUrl: string | null = null;
    if (article.featured_image) {
      fullFeaturedImageUrl = buildAbsoluteUrl(DJANGO_API, article.featured_image);
    }

    console.log('Article data in page:', {
      title: article.title,
      contentLength: article.content?.length || 0,
      hasContent: Boolean(article.content),
      contentPreview: article.content?.substring(0, 50),
      status: article.status,
      featured_image: article.featured_image,
      fullFeaturedImageUrl,
    });

    return (
      <div suppressHydrationWarning className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article suppressHydrationWarning className="mx-auto">
          <header suppressHydrationWarning className="mb-12">
            <div suppressHydrationWarning className="flex items-center space-x-2 mb-4">
              <span suppressHydrationWarning className="px-3 py-1 text-sm font-medium bg-[#fdebd0] text-[#dc143c] rounded-full">
                {article.category.name}
              </span>
              <time
                dateTime={article.published_at}
                className="text-sm text-gray-500"
                suppressHydrationWarning
              >
                Created on {new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </time>
              {article.updated_at && article.updated_at !== article.published_at && (
                <span className="text-sm text-gray-400" suppressHydrationWarning>
                  (Last updated on {new Date(article.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                  })})
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  {article.author.image ? (
                    <Image
                      src={buildAbsoluteUrl(DJANGO_API, article.author.image)}
                      alt={article.author.name || 'Author'}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      {article.author.name?.[0] || 'A'}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  <Link href={`/profiles/${article.author.id}`} className="hover:text-[#dc143c] transition">
                    {article.author.name || 'Anonymous'}
                  </Link>
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-serif text-[#dc143c] mb-4">
              {article.title}
            </h1>

            <p className="text-xl text-gray-600">{article.excerpt}</p>
          </header>

          {fullFeaturedImageUrl && (
            <FeaturedImage src={fullFeaturedImageUrl} alt={article.title} />
          )}

          {article.content ? (
            <div 
              suppressHydrationWarning
              className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="prose prose-lg max-w-none text-gray-400 italic">
              No content available
            </div>
          )}

          {article.tags && article.tags.length > 0 && (
            <div suppressHydrationWarning className="mt-16 pt-8 border-t border-gray-100">
              <div suppressHydrationWarning className="flex flex-wrap gap-2">
                {article.tags?.map((tag: ArticleTag) => (
                  <span
                    key={tag.slug}
                    suppressHydrationWarning
                    className="px-3 py-1 text-sm bg-[#fdebd0] text-[#dc143c] rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <ArticleActions 
            articleId={article.id} 
            authorId={article.author.id}
            slug={article.slug}
            status={article.status}
          />

          <ArticleComments 
            articleId={article.id}
            articleTitle={article.title}
            articleExcerpt={article.excerpt}
            initialLikesCount={article.likes_count || 0}
            initialUserLiked={article.user_liked || false}
            initialComments={article.comments || []}
          />
        </article>
      </div>
    );
  } catch (error) {
    console.error('Error fetching article:', error);
    notFound();
  }
}