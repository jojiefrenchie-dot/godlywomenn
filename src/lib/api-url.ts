/**
 * Get the backend API URL
 * - In development: use DJANGO_API_URL or localhost:8000
 * - In production: use NEXT_PUBLIC_DJANGO_API environment variable
 * - For client-side API routes: use relative paths
 */
export function getBackendUrl(isServerSide = false) {
  // Use environment variables first
  const backendUrl = process.env.DJANGO_API_URL || process.env.NEXT_PUBLIC_DJANGO_API;
  
  if (backendUrl) {
    return backendUrl;
  }
  
  // Fallback for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  
  // For client-side API routes in production: return empty (use relative paths)
  if (!isServerSide) {
    return '';
  }
  
  // No backend URL available - this will cause errors
  console.warn('No DJANGO_API_URL or NEXT_PUBLIC_DJANGO_API configured');
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
