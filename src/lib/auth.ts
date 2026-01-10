import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { refreshAccessToken } from "./refreshToken";
import { getApiUrl } from "./api-url";

const DJANGO_API = process.env.DJANGO_API_URL || process.env.NEXT_PUBLIC_DJANGO_API || "http://127.0.0.1:8000";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      }
    },
    callbackUrl: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      }
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      }
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "hello@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          console.log('[AUTHORIZE] Attempting to authenticate:', credentials.email);
          
          // Call Django token endpoint to get JWT
          const tokenUrl = getApiUrl('/api/auth/token/', true); // true = server-side
          console.log('[AUTHORIZE] Token URL:', tokenUrl);
          
          const tokenRes = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });

          if (!tokenRes.ok) {
            console.error('[AUTHORIZE] Django token endpoint returned', tokenRes.status);
            const errorData = await tokenRes.json().catch(() => ({}));
            console.error('[AUTHORIZE] Error data:', errorData);
            throw new Error(errorData.detail || errorData.message || "Invalid credentials");
          }

          const tokenData = await tokenRes.json();
          const { access, refresh } = tokenData;
          if (!access || !refresh) {
            console.error('[AUTHORIZE] No tokens in response:', tokenData);
            throw new Error("No tokens in response");
          }

          console.log('[AUTHORIZE] Got tokens from Django');

          // Fetch user info from Django
          const userUrl = getApiUrl('/api/auth/me/', true); // true = server-side
          console.log('[AUTHORIZE] User URL:', userUrl);
          
          const userRes = await fetch(userUrl, {
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${access}`,
              'Accept': 'application/json',
            },
          });

          if (!userRes.ok) {
            console.error('[AUTHORIZE] Failed to fetch user from Django me endpoint', userRes.status);
            throw new Error("Failed to load user info");
          }

          const user = await userRes.json();
          console.log('[AUTHORIZE] Got user info:', user.email);

          // Return user with tokens
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            accessToken: access,
            refreshToken: refresh,
          };
        } catch (err) {
          console.error('[AUTHORIZE] Error:', err);
          throw new Error(err instanceof Error ? err.message : "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        if (token.error === 'RefreshAccessTokenError') {
          return { 
            ...session, 
            error: 'RefreshAccessTokenError',
            expires: new Date(Date.now()).toISOString()
          };
        }

        return {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
            name: token.name || session.user?.name || "User",
            email: token.email || session.user?.email,
            image: token.picture || session.user?.image || undefined,
          },
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          accessTokenExpires: token.accessTokenExpires,
          error: token.error || undefined,
        } as any;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // If initial sign in
      if (user) {
        console.log('[JWT CALLBACK] New sign-in, user:', user.email);
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        const maybeAccess = (user as unknown as { accessToken?: string })?.accessToken;
        if (maybeAccess) {
          token.accessToken = maybeAccess;
          token.accessTokenExpires = Date.now() + 900 * 1000; // 15 minutes from now
          token.refreshToken = (user as any).refreshToken;
          token.error = undefined;
          console.log('[JWT CALLBACK] Tokens set, expires in 15 minutes');
        }
      }

      // If the access token has expired, attempt to refresh
      if (!token.accessTokenExpires || Date.now() >= (token.accessTokenExpires as number)) {
        console.log('[JWT Callback] Token expired, attempting refresh, email:', token.email);
        return refreshAccessToken(token);
      }

      // Token is still valid
      return token;
    },
  },
};