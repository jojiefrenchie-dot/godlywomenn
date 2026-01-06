/**
 * Get the backend API URL
 * In production on Render, both frontend and backend are on same service,
 * so use relative paths. In development, use environment variables.
 */
export function getBackendUrl() {
  // In production, use relative paths (same domain)
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  // In development, use environment variable or localhost
  return process.env.DJANGO_API_URL || process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';
}

/**
 * Build API endpoint URL
 * @param path - API path like '/api/auth/register/'
 * @returns Full URL or relative path depending on environment
 */
export function getApiUrl(path: string) {
  const baseUrl = getBackendUrl();
  return baseUrl ? `${baseUrl}${path}` : path;
}
