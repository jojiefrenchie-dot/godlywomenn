import { getServerSession, type NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function requireAuth() {
  const session = await getServerSession(authOptions as unknown as NextAuthOptions);
  
  if (!session) {
    redirect(`/login`);
  }

  // Check for refresh token error
  if ((session as any).error === 'RefreshAccessTokenError') {
    console.error('Session has refresh token error');
    redirect(`/login?error=refresh_token_expired`);
  }

  // Check if we have an access token
  if (!(session as any).accessToken) {
    console.error('No access token in session');
    redirect(`/login?error=no_access_token`);
  }

  return session;
}
