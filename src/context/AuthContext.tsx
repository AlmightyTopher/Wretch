"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const auth = await getFirebaseAuth();
        const unsubscribe = auth.onAuthStateChanged((user) => {
          setUser(user);
          setLoading(false);
        });

        // Clean up the subscription
        return () => unsubscribe();
      } catch (error) {
        console.error("Error initializing Firebase Auth:", error);
        setLoading(false); // Ensure loading is set to false even if auth init fails
      }
    };

    setupAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};