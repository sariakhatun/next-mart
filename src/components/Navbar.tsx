'use client';

import { useState } from 'react';
import { ShoppingCart, Menu, X, LogOut } from 'lucide-react';
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

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                NextMart
              </span>
            </Link>
          </div>

          {/* Nav links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                pathname === '/' ? 'text-cyan-600 font-bold' : 'text-gray-700 hover:text-cyan-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`font-medium transition-colors ${
                pathname === '/products'
                  ? 'text-cyan-600 font-bold'
                  : 'text-gray-700 hover:text-cyan-600'
              }`}
            >
              Products
            </Link>

            {session ? (
              <>
                {/* Cart */}
                <Link
                  href="/cart"
                  className="relative text-gray-700 hover:text-cyan-600"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                   {totalItems}
                  </span>
                </Link>

                {/* Profile Image */}
                <Link
                  href="/profile"
                  className={`flex items-center space-x-2 font-medium transition-colors ${
                    pathname === '/profile' ? 'text-cyan-600 font-bold' : 'text-gray-700 hover:text-cyan-600'
                  }`}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700">
                      {session.user?.name?.[0] || 'U'}
                    </div>
                  )}
                  <span>Profile</span>
                </Link>

                {/* Logout */}
                <button
                  onClick={async () => {
                    await signOut({ redirect: false }); 
                    Swal.fire({
                      icon: 'info',
                      title: 'Logged Out',
                      text: 'You have been successfully logged out.',
                      confirmButtonColor: '#06b6d4',
                    }).then(() => {
                      window.location.href = '/'; 
                    });
                  }}
                  className="flex items-center space-x-2 text-red-600 font-medium py-2 px-4 rounded-lg hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-cyan-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-cyan-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-2">
            <div className="flex flex-col space-y-3 pt-4">
              <Link
                href="/"
                className={`font-medium py-2 px-4 rounded-lg transition-colors ${
                  pathname === '/' ? 'text-cyan-600 font-bold bg-cyan-50' : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`font-medium py-2 px-4 rounded-lg transition-colors ${
                  pathname === '/products'
                    ? 'text-cyan-600 font-bold bg-cyan-50'
                    : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>

              {session ? (
                <>
                  <Link
                    href="/cart"
                    className="relative font-medium py-2 px-4 rounded-lg text-gray-700 hover:text-cyan-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 font-medium py-2 px-4 rounded-lg text-gray-700 hover:text-cyan-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xs">
                        {session.user?.name?.[0] || 'U'}
                      </div>
                    )}
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-red-600 font-medium py-2 px-4 rounded-lg hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
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
