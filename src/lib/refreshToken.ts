import { getApiUrl } from './api-url';

export async function refreshAccessToken(token: any) {
  try {
    if (!token.refreshToken) {
      console.error('[TOKEN_REFRESH] ✗ No refresh token available');
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }

    console.log('[TOKEN_REFRESH] Attempting to refresh token for user:', token.email);

    // Try to refresh the token
    const refreshUrl = getApiUrl('/api/auth/token/refresh/', true); // true = server-side
    console.log('[TOKEN_REFRESH] Using refresh endpoint:', refreshUrl);
    
    const response = await fetch(refreshUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        refresh: token.refreshToken 
      }),
    });

    console.log('[TOKEN_REFRESH] Endpoint response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { raw: errorText };
      }
      console.error('[TOKEN_REFRESH] ✗ Token refresh failed:');
      console.error('  Status:', response.status);
      console.error('  Error:', errorData);
      console.error('  Headers:', {
        'content-type': response.headers.get('content-type'),
        'cors': response.headers.get('access-control-allow-origin'),
      });
      
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }

    const refreshedTokens = await response.json();
    console.log('[TOKEN_REFRESH] ✓ Token refresh successful');

    if (!refreshedTokens.access) {
      console.error('[TOKEN_REFRESH] ✗ No access token in refresh response:', refreshedTokens);
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }

    return {
      ...token,
      accessToken: refreshedTokens.access,
      refreshToken: refreshedTokens.refresh || token.refreshToken,
      accessTokenExpires: Date.now() + 900 * 1000, // 15 minutes from now
      error: undefined,
    };
  } catch (error) {
    console.error('[TOKEN_REFRESH] ✗ Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}