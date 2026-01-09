import { getNextApiUrl, getDjangoApiUrl, fetchWithAuth } from './api';

export async function uploadArticleImage(file: File) {
  try {
    const formData = new FormData();
    formData.append('featured_image', file);

    const sessionResp = await fetch('/api/auth/session');
    let accessToken: string | null = null;
    if (sessionResp.ok) {
      const sessionJson = await sessionResp.json();
      accessToken = sessionJson?.accessToken ?? null;
    }

    const response = await fetchWithAuth(getDjangoApiUrl('/api/articles/upload-image/'), {
      method: 'POST',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error instanceof Error ? error : new Error('Failed to upload image');
  }
}

export type ArticleTag = {
  id: string;
  name: string;
  slug: string;
};

export type ArticleCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type ArticleAuthor = {
  id: string;
  name: string;
  image?: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published';
  view_count: number;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  category: {
    name: string;
    slug: string;
  };
  tags?: ArticleTag[];
  likes_count?: number;
  user_liked?: boolean;
  comments?: any[];
};

export type ArticleFilters = {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
  includeAll?: boolean;
  authorId?: string;
};

export async function getArticles(filters: ArticleFilters = {}) {
  const { category, search, page = 1, limit = 10, authorId } = filters;

  // Build URL parameters
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (category) params.set('category', category);
  if (search) params.set('search', search);
  if (filters.includeAll) params.set('includeAll', '1');
  if (authorId) params.set('author', authorId);
  
  // Set default status filter to published, but show all if includeAll is true
  if (!filters.includeAll) {
    params.set('status', 'published');
  }

  // Get session token for authenticated requests
  let accessToken: string | null = null;
  try {
    const sessionResp = await fetch('/api/auth/session');
    if (sessionResp.ok) {
      const sessionJson = await sessionResp.json();
      accessToken = sessionJson?.accessToken ?? null;
    }
  } catch (e) {
    console.error('Failed to get session:', e);
  }

  try {
    const res = await fetchWithAuth(getDjangoApiUrl(`/api/articles/?${params.toString()}`), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
      },
      cache: 'no-store'  // Ensure we always get fresh data
    });

    if (!res.ok) {
      console.error('Failed to fetch articles from Django', res.status);
      throw new Error('Failed to fetch articles');
    }

    console.log('Articles response:', res.status);
    const data = await res.json();
    console.log('Articles data:', data);

    // Handle both array responses and paginated responses
    if (Array.isArray(data)) {
      return {
        articles: data,
        total: data.length,
        page: 1,
        limit,
        totalPages: 1,
      };
    }

    // Handle paginated response
    if (data.results) {
      return {
        articles: data.results,
        total: data.count || data.results.length,
        page: page,
        limit,
        totalPages: Math.ceil((data.count || data.results.length) / limit),
      };
    }

    // Fallback for other response formats
    return {
      articles: data.articles || [],
      total: data.total || 0,
      page: data.page || page,
      limit: data.limit || limit,
      totalPages: data.totalPages || 0,
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Return empty articles list on error instead of throwing
    return {
      articles: [],
      total: 0,
      page: page,
      limit,
      totalPages: 0,
    };
  }
}

export async function getArticleBySlug(slug: string) {
  // Call Django API directly from server-to-server
  const djangoApi = process.env.DJANGO_API_URL || process.env.NEXT_PUBLIC_DJANGO_API || 'http://127.0.0.1:8000';
  const res = await fetch(`${djangoApi}/api/articles/by-slug/${encodeURIComponent(slug)}/`, {
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store' // Ensure we get fresh data
  });

  if (!res.ok) {
    console.error('Article fetch failed:', res.status);
    if (res.status === 404) return null;
    throw new Error('Failed to fetch article');
  }
  
  const data = await res.json();
  
  const article = data;
  if (!article) return null;
  
  // Ensure category has the required properties
  if (!article.category || typeof article.category === 'string') {
    const categoryRes = await fetch(`${djangoApi}/api/categories/${article.category}/`, {
      headers: { 'Accept': 'application/json' }
    });
    if (categoryRes.ok) {
      const categoryData = await categoryRes.json();
      article.category = categoryData;
    } else {
      // Provide a fallback if category can't be fetched
      article.category = { name: 'Uncategorized', slug: 'uncategorized' };
    }
  }
  
  return article;
}

async function handleApiResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  
  if (!response.ok) {
    let errorMessage = '';
    try {
      if (isJson) {
        const errorData = await response.json();
        if (typeof errorData === 'object' && errorData !== null) {
          // Handle validation errors
          const errors = Object.entries(errorData)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([field, errors]) => {
              const errorMessages = Array.isArray(errors) ? errors.join(', ') : String(errors);
              return `${field}: ${errorMessages}`;
            })
            .filter(msg => msg.length > 0);
            
          if (errors.length > 0) {
            errorMessage = errors.join('; ');
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        }
      } else {
        errorMessage = await response.text();
      }
    } catch (e) {
      errorMessage = `Server error (${response.status})`;
    }

    // Use specific error messages for common status codes
    switch (response.status) {
      case 401:
        throw new Error('Your session has expired. Please log in again.');
      case 403:
        throw new Error('You do not have permission to perform this action.');
      case 404:
        throw new Error('The requested resource was not found.');
      case 400:
        throw new Error(errorMessage || 'Invalid request. Please check your input.');
      default:
        throw new Error(errorMessage || 'An unexpected error occurred.');
    }
  }

  // Handle successful response
  try {
    if (isJson) {
      return await response.json();
    }
    return await response.text();
  } catch (e) {
    throw new Error('Failed to parse server response.');
  }
}

export async function createArticle(data: {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: File | null;
  category_id: string;
  tags?: string[];
  author_id?: string;
}) {
  try {
    const sessionResp = await fetch('/api/auth/session');
    let accessToken: string | null = null;
    if (sessionResp.ok) {
      const sessionJson = await sessionResp.json();
      accessToken = sessionJson?.accessToken ?? null;
    }

    // Use FormData if there's a file to upload
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content || '');
    formData.append('excerpt', data.excerpt || '');
    formData.append('category_id', data.category_id);
    formData.append('status', 'draft');
    
    if (data.featured_image) {
      formData.append('featured_image', data.featured_image);
    }

    const response = await fetchWithAuth(getDjangoApiUrl('/api/articles/'), {
      method: 'POST',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: formData,
    });

    return await handleApiResponse(response);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to create article');
  }
}

export async function getCategories() {
  try {
    // Use local proxy route instead of calling Django directly
    const response = await fetch('/api/categories', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    if (!response.ok) {
      // If unauthorized, return empty list so the create page can still render
      if (response.status === 401) {
        console.warn('Categories fetch returned 401 — treating as empty list');
        return [];
      }
      console.error('Categories fetch failed:', response.status);
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    console.log('Categories data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function getTags() {
  const res = await fetchWithAuth(getDjangoApiUrl('/api/tags/'));
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}

export async function updateArticleStatus(articleId: string, status: 'draft' | 'published') {
  try {
    // Instead of using the Django API directly, use our Next.js API route
    const response = await fetch(`/api/articles/${articleId}/update-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (errorData && typeof errorData === 'object') {
        const errors = Object.entries(errorData)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('; ');
        throw new Error(errors || 'Failed to update article status');
      }
      throw new Error('Failed to update article status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating article status:', error);
    throw error instanceof Error ? error : new Error('Failed to update article status');
  }
}