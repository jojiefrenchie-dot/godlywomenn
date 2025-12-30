const DJANGO_API = process.env.DJANGO_API_URL || process.env.NEXT_PUBLIC_DJANGO_API || "http://127.0.0.1:8000";

export async function refreshAccessToken(token: any) {
  try {
    if (!token.refreshToken) {
      console.error('No refresh token available');
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }

    console.log('Attempting to refresh token');

    // Try to refresh the token
    const response = await fetch(`${DJANGO_API}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        refresh: token.refreshToken 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Token refresh failed:', response.status, errorData);
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }

    const refreshedTokens = await response.json();
    console.log('Token refresh successful');

    if (!refreshedTokens.access) {
      console.error('No access token in refresh response');
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
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}