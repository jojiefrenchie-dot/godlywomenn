// articles.ts - Article utilities and types

export interface ArticleTag {
  id: string;
  name: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: string;
  category?: ArticleCategory;
  author_id: string;
  status?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  tags: ArticleTag[];
}

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  { id: '1', name: 'Faith', slug: 'faith' },
  { id: '2', name: 'Inspiration', slug: 'inspiration' },
  { id: '3', name: 'Community', slug: 'community' },
  { id: '4', name: 'Bible Study', slug: 'bible-study' },
  { id: '5', name: 'Daily Devotion', slug: 'daily-devotion' },
];

export function getCategories(): ArticleCategory[] {
  return ARTICLE_CATEGORIES;
}

export function getCategoryById(id: string): ArticleCategory | undefined {
  return ARTICLE_CATEGORIES.find(cat => cat.id === id);
}

export function getCategoryBySlug(slug: string): ArticleCategory | undefined {
  return ARTICLE_CATEGORIES.find(cat => cat.slug === slug);
}

export async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8000'}/api/articles`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8000'}/api/articles/${slug}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function createArticle(data: Partial<Article>): Promise<Article | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8000'}/api/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    return null;
  }
}

export async function updateArticle(slug: string, data: Partial<Article>): Promise<Article | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8000'}/api/articles/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error updating article:', error);
    return null;
  }
}

export async function deleteArticle(slug: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8000'}/api/articles/${slug}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting article:', error);
    return false;
  }
}
