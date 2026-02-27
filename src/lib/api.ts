// api.ts
// For production: Set NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_BACKEND_API in environment
// For development: Uses localhost defaults
export const NEXT_API = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8000';

export function getNextApiUrl(path: string) {
  return `${NEXT_API}${path}`;
}

export function getBackendApiUrl(path: string) {
  return `${BACKEND_API}${path}`;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  let retryCount = 0;

  const attemptFetch = async (): Promise<Response> => {
    // On server-side, resolve relative URLs using NEXT_API
    let resolvedUrl = url;
    if (typeof window === 'undefined' && url.startsWith('/')) {
      resolvedUrl = `${String(NEXT_API).replace(/\/$/, '')}${url}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const bodyIsFormData = (options.body && (options.body as any) instanceof FormData);
      const baseHeaders: HeadersInit = {
        'Accept': 'application/json',
        ...(bodyIsFormData ? {} : { 'Content-Type': 'application/json' }),
      };
      
      // Get token from localStorage and add to Authorization header
      let token = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken');
      }
      
      const headers = {
        ...baseHeaders,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
      };

      const response = await fetch(resolvedUrl, {
        ...options,
        credentials: 'include',
        headers,
        signal: controller.signal
      });

      clearTimeout(timeout);

      // Handle 401 - attempt token refresh and retry once
      if (response.status === 401 && retryCount === 0) {
        retryCount++;
        
        try {
          const refreshResp = await fetch(`${NEXT_API}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });

          if (refreshResp.ok) {
            console.debug('Token refreshed, retrying original request...');
            return attemptFetch();
          }
        } catch (e) {
          console.error('Token refresh failed:', e);
        }
      }

      if (!response.ok) {
        const errorBody = await response.clone().text();
        console.error(`HTTP error! status: ${response.status}, url: ${resolvedUrl}, body: ${errorBody}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (fetchError) {
      clearTimeout(timeout);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        const timeoutError = new Error('Request timeout: The server took too long to respond');
        timeoutError.name = 'TimeoutError';
        throw timeoutError;
      }
      
      throw fetchError;
    }
  };

  try {
    return await attemptFetch();
  } catch (error) {
    console.error('API request failed:', error, 'URL:', url);
    throw error;
  }
}