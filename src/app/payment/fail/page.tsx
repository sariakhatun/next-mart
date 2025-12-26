'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Separate Client Component for using useSearchParams
function FailContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const tran_id = searchParams.get('tran_id');

  const getErrorMessage = (reason: string | null) => {
    switch (reason) {
      case 'validation_failed':
        return 'Payment verification failed.';
      case 'server_error':
        return 'A server error occurred. Please try again.';
      case 'missing_data':
        return 'Required information was not found.';
      default:
        return 'The payment process was not completed.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Failed
        </h1>
        
        <p className="text-gray-600 mb-6">
          {getErrorMessage(reason)}
        </p>

        {/* Error Details */}
        {(tran_id || reason) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            {tran_id && (
              <div className="mb-2">
                <p className="text-xs text-red-600 mb-1">Transaction ID</p>
                <p className="text-xs font-mono text-red-800 break-all">
                  {tran_id}
                </p>
              </div>
            )}
            {reason && (
              <div>
                <p className="text-xs text-red-600 mb-1">Error Code</p>
                <p className="text-xs font-mono text-red-800">
                  {reason}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Possible Reasons */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-yellow-800 mb-2">
            Possible Reasons:
          </p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
            <li>Insufficient balance</li>
            <li>Incorrect card details</li>
            <li>Declined by bank</li>
            <li>Network issue</li>
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="block w-full bg-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-cyan-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Try Again
          </Link>
          
          <Link
            href="/cart"
            className="block w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            Back to Cart
          </Link>

          <Link
            href="/"
            className="block w-full text-gray-600 py-2 hover:text-gray-800 transition-colors duration-200"
          >
            Go to Homepage
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Contact us for assistance
          </p>
          <p className="text-sm font-semibold text-gray-700 mt-1">
            📞 Support: 01XXX-XXXXXX
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment status...</p>
        </div>
      </div>
    }>
      <FailContent />
    </Suspense>
  );
}