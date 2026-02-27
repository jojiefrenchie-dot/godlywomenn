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
    console.log('[API_URL] Using configured backend URL:', backendUrl);
    return backendUrl;
  }
  
  // Fallback for development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API_URL] Using development fallback: http://localhost:8000');
    return 'http://localhost:8000';
  }
  
  // Production fallback - try to infer from window location
  if (!isServerSide && typeof window !== 'undefined') {
    // In production on Vercel, try to use the same domain or a known backend
    const inferredUrl = window.location.hostname.includes('vercel.app')
      ? 'https://godlywomenn.onrender.com' // Default to known Render backend
      : 'http://localhost:8000';
    console.warn('[API_URL] No DJANGO_API_URL configured, using fallback:', inferredUrl);
    return inferredUrl;
  }
  
  // For server-side in production without URL - use known production URL
  console.warn('[API_URL] No DJANGO_API_URL configured for server-side, using Render backend');
  return 'https://godlywomenn.onrender.com';
}

/**
 * Build API endpoint URL
 * @param path - API path like '/api/auth/register/'
 * @param isServerSide - whether this is server-side code (needs absolute URL for Render)
 * @returns Full URL or relative path depending on context
 */
export function getApiUrl(path: string, isServerSide = false) {
  const baseUrl = getBackendUrl(isServerSide);
  const fullUrl = baseUrl ? `${baseUrl}${path}` : path;
  console.log('[API_URL] Building URL for:', path, '→', fullUrl);
  return fullUrl;
}
