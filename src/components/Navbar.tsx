'use client';

import { useState } from 'react';
import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Swal from 'sweetalert2';
import { useCartContext } from '../context/CartContext';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { cart } = useCartContext();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: false });
    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
      confirmButtonColor: '#06b6d4',
      timer: 1500,
    });
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">NextMart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Main Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-cyan-600 font-bold'
                    : 'text-gray-700 hover:text-cyan-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

          
            {session && (
              <div className="flex items-center space-x-6">
                {/* Cart */}
                <Link href="/cart" className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-cyan-600 transition" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* Profile */}
                <Link href="/profile" className="flex items-center space-x-2 group">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={36}
                      height={36}
                      className="rounded-full object-cover ring-2 ring-transparent group-hover:ring-cyan-600 transition"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-medium">
                      {session.user?.name?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                    </div>
                  )}
                  <span className={`font-medium ${pathname === '/profile' ? 'text-cyan-600' : 'text-gray-700'} group-hover:text-cyan-600 transition`}>
                    {session.user?.name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}

          
            {!session && (
              <Link
                href="/login"
                className="bg-cyan-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-cyan-700 transition shadow-sm"
              >
                Login
              </Link>
            )}
          </div>

        
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 p-2"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {/* Main Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-4 rounded-lg font-medium transition ${
                    pathname === link.href
                      ? 'text-cyan-600 bg-cyan-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

          
              {session ? (
                <>
                  <Link
                    href="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="relative py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
                  >
                    
                    <span>Cart</span>
                   
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        {session.user?.name?.[0] || <User className="w-5 h-5" />}
                      </div>
                    )}
                    <span className="font-medium">Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 font-medium text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 px-4 bg-cyan-600 text-white text-center rounded-lg font-medium hover:bg-cyan-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}