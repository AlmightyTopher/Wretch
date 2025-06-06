"use client";

import React from 'react';
import LogoutButton from '@/components/LogoutButton';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      {/* TODO: Add dashboard content here */}
      <LogoutButton />
    </div>
  );
};

export default AdminDashboardPage;
