// NextAuth configuration using Firebase admin for credential verification

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { adminAuth } from '../../../lib/firebase-admin';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        idToken: { label: 'ID Token', type: 'text' }, // Expecting the Firebase ID token
      },
      async authorize(credentials) {

        const idToken = credentials?.idToken;
        if (!idToken) {
          return null;
        }

        try {
          const decodedToken = await adminAuth.verifyIdToken(idToken);
          const { uid, email, customClaims } = decodedToken;

          // Return a user object that will be saved in the JWT
          return {
            id: uid,
            email: email,
            // Include custom claims or default role if needed
            role: customClaims?.role || 'user', // Assuming 'role' is a custom claim
          };
        } catch (error) {
          console.error("Error verifying Firebase ID token:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user?.role) token.role = user.role;
      if (user?.id) token.uid = user.id;
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user && token?.role) session.user.role = token.role;
      if (session.user && token?.uid) session.user.id = token.uid;
      return session;
    },
  },
  pages: {
    signIn: '/admin',
    error: '/admin?error=auth',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // Enable NextAuth debug mode in development
};

console.log("[NextAuth] NEXTAUTH_SECRET Loaded:", !!process.env.NEXTAUTH_SECRET);
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("[NextAuth] WARNING: NEXTAUTH_SECRET is not set. This will cause errors in production and is highly insecure.");
}

export default NextAuth(authOptions);
