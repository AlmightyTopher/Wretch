"use client";

import React from 'react';
import { signOutUser } from '../services/authService';

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
      await signOutUser();
      // TODO: Add redirection after logout if needed, e.g., to /admin/login
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      // TODO: Add user-friendly error message display
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
