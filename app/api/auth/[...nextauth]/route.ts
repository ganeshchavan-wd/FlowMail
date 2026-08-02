import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";

// Refresh an expired Google access token using the stored refresh token
async function refreshAccessToken(refreshToken: string) {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    const refreshed = await response.json();

    if (!response.ok) throw refreshed;

    return {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? refreshToken, // keep old one if not rotated
      expiresAt: Math.floor(Date.now() / 1000) + refreshed.expires_in,
      error: undefined,
    };
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return { error: "RefreshAccessTokenError" };
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // access_type: offline gives us a refresh_token
          // prompt: consent forces Google to always return a refresh_token
          access_type: "offline",
          prompt: "consent",
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user }: any) {
      if (!user?.email) return false;

      // Upsert user using the singleton db client (fixes issue #9)
      await db.user.upsert({
        where: { email: user.email },
        update: { name: user.name, image: user.image },
        create: { email: user.email, name: user.name, image: user.image },
      });

      return true;
    },

    async jwt({ token, account }: any) {
      // First sign-in — store all token data including refresh_token
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at, // Unix timestamp in seconds
        };
      }

      // Token still valid — return as-is
      if (Date.now() < (token.expiresAt as number) * 1000 - 30_000) {
        return token;
      }

      // Token expired — attempt refresh (fixes issue #1)
      if (!token.refreshToken) {
        return { ...token, error: "NoRefreshToken" };
      }

      const refreshed = await refreshAccessToken(token.refreshToken as string);
      if (refreshed.error) {
        return { ...token, error: refreshed.error };
      }

      return {
        ...token,
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        expiresAt: refreshed.expiresAt,
        error: undefined,
      };
    },

    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.error = token.error; // surface token errors to the client
      return session;
    },

    async redirect({ url, baseUrl }: any) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/dashboard`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
