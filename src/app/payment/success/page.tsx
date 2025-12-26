'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useCartContext } from '@/src/context/CartContext';

// Separate Client Component that uses useSearchParams and useEffect
function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCartContext();

  const tran_id = searchParams.get('tran_id');
  const amount = searchParams.get('amount');

  // Use ref to track if cart has been cleared (prevent multiple clears)
  const hasCleared = useRef(false);

  useEffect(() => {
    if (tran_id && !hasCleared.current) {
      hasCleared.current = true;
      clearCart();
    }
  }, [tran_id, clearCart]); // clearCart is stable from context, safe to include

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-cyan-50 px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your order has been successfully completed. Thank you!
        </p>
        
        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          {tran_id && (
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
              <p className="text-sm font-mono font-semibold text-gray-800 break-all">
                {tran_id}
              </p>
            </div>
          )}
          
          {amount && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-green-600">
                ৳{parseFloat(amount).toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Confirmation Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            📧 A confirmation email has been sent to your inbox.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/orders"
            className="block w-full bg-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-cyan-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            View My Orders
          </Link>
          
          <Link
            href="/"
            className="block w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            Back to Homepage
          </Link>
        </div>

        {/* Support Info */}
        <p className="text-xs text-gray-500 mt-6">
          If you have any issues, please contact us.
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}