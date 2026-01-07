/**
 * Get the backend API URL
 * - On Render with both services: use localhost:8000 for server-side (internal)
 * - For client-side API routes: use relative paths (same domain)
 */
export function getBackendUrl(isServerSide = false) {
  // In development, use environment variable or localhost
  if (process.env.NODE_ENV === 'development') {
    return process.env.DJANGO_API_URL || process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';
  }
  
  // In production on Render
  // For server-side (NextAuth, token refresh): use localhost:8000 (internal service routing)
  if (isServerSide) {
    return 'http://localhost:8000';
  }
  
  // For client-side API routes: return empty (use relative paths)
  return '';
}

/**
 * Build API endpoint URL
 * @param path - API path like '/api/auth/register/'
 * @param isServerSide - whether this is server-side code (needs absolute URL for Render)
 * @returns Full URL or relative path depending on context
 */
export function getApiUrl(path: string, isServerSide = false) {
  const baseUrl = getBackendUrl(isServerSide);
  return baseUrl ? `${baseUrl}${path}` : path;
}
