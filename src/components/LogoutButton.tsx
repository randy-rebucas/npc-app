'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/login', // Optional: redirect after logout
      redirect: true 
    });
  };

  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
      Logout
    </button>
  );
} 