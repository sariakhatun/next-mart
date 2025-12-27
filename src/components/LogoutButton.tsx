'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Swal from 'sweetalert2';
import React from 'react';

interface LogoutButtonProps {
  className?: string;
  redirectUrl?: string; 
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  redirectUrl = '/',
}) => {
  const handleLogout = async () => {
    await signOut({ redirect: false }); 

    Swal.fire({
      icon: 'info',
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
      confirmButtonColor: '#06b6d4',
    }).then(() => {
      window.location.href = redirectUrl;
    });
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center space-x-2 text-red-600 font-medium py-2 px-4 rounded-lg hover:bg-red-50 transition-colors ${className}`}
    >
      <LogOut className="w-5 h-5" />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
