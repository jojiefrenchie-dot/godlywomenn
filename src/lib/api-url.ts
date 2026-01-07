/**
 * Get the backend API URL
 * - For client-side: use relative paths (same domain)
 * - For server-side: use absolute URLs
 */
export function getBackendUrl(isServerSide = false) {
  // In production, use the domain
  if (process.env.NODE_ENV === 'production') {
    // If it's a relative request (client-side), return empty
    if (!isServerSide) {
      return '';
    }
    // For server-side, we need absolute URL
    // On Render, use the full domain or try localhost
    return 'https://godlywomenn.onrender.com';
  }
  
  // In development, use environment variable or localhost
  return process.env.DJANGO_API_URL || process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';
}

/**
 * Build API endpoint URL
 * @param path - API path like '/api/auth/register/'
 * @param isServerSide - whether this is server-side code (needs absolute URL)
 * @returns Full URL or relative path depending on context
 */
export function getApiUrl(path: string, isServerSide = false) {
  const baseUrl = getBackendUrl(isServerSide);
  return baseUrl ? `${baseUrl}${path}` : path;
}
