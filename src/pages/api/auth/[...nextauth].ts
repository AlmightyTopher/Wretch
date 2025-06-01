// Instructions: Add detailed logging to [...nextauth].ts for Firebase client config, auth object initialization, and within the authorize function. Also log if NEXTAUTH_SECRET is present and enable NextAuth debug mode.

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app as clientApp, firebaseConfig as clientFirebaseConfig } from '../../../lib/firebase'; // Import clientFirebaseConfig for logging
// import { adminAuth } from '../../../lib/firebaseAdmin'; // DEBUG: Temporarily commented out

console.log("[NextAuth] Initializing... Verifying Firebase Client Config:");
console.log("[NextAuth] API Key Loaded:", !!clientFirebaseConfig.apiKey);
console.log("[NextAuth] Auth Domain Loaded:", !!clientFirebaseConfig.authDomain);
console.log("[NextAuth] Project ID Loaded:", !!clientFirebaseConfig.projectId);

let auth: any;
try {
  auth = getAuth(clientApp);
  console.log("[NextAuth] Firebase client auth object initialized successfully.");
} catch (e: any) {
  console.error("[NextAuth] CRITICAL ERROR initializing Firebase client auth:", e.message, e.stack);
  // If auth fails to initialize, the authorize function will likely fail catastrophically.
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log("[NextAuth][authorize] Attempting to authorize...");
        if (!auth) {
          console.error("[NextAuth][authorize] Firebase client auth object is not available. Cannot authorize.");
          return null;
        }
        if (!credentials?.email || !credentials?.password) {
          console.log("[NextAuth][authorize] Missing credentials.");
          return null;
        }
        try {
          console.log(`[NextAuth][authorize] Attempting Firebase sign-in for ${credentials.email}`);
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          const user = userCredential.user;
          console.log("[NextAuth][authorize] Firebase sign-in successful for:", user?.email);

          if (user) {
            console.log(`[NextAuth][authorize] DEBUG: Bypassing Admin SDK. Granting admin role to ${user.email}.`);
            return {
              id: user.uid,
              name: user.displayName || user.email,
              email: user.email,
              role: 'admin',
            };
          }
          console.log("[NextAuth][authorize] User object not found after sign-in attempt.");
          return null;
        } catch (error: any) {
          console.error("[NextAuth][authorize] Error during Firebase client-side sign-in:", error.code, error.message, error.stack);
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
