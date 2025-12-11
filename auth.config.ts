import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminPath = nextUrl.pathname.startsWith("/admin");

      if (isAdminPath) {
        if (isLoggedIn) {
          // Add logic here to check for admin role if available in session
          // For now, assuming any logged in user on this path is checked by the provider or subsequent logic
          // But ideally, check auth.user.role here if custom session strategy is used
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        // @ts-ignore
        session.user.role = token.role;
       
        // @ts-ignore
        session.user.image = token.image;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
        // @ts-ignore
        token.image = user.image;
      }

      // Handle session update
      if (trigger === "update" && session) {
        token = { ...token, ...session.user };
      }

      return token;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
