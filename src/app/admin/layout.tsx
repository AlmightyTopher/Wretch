"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    if (!loading && !user && isClient) {
      router.push('/admin');
    }
  }, [user, loading, router, isClient]);

  if (loading || !isClient) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // This case is theoretically handled by the useEffect redirect,
    // but as a fallback or while useEffect is processing on the client side,
    // we could render nothing or a specific "Access Denied" message
    // for now, returning null or a loading state is fine before redirect
    return null; // Or a loading state if needed
  }

  // If user is authenticated, render the admin content
  return <>{children}</>;
};

export default AdminLayout;
