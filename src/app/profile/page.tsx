'use client';

import { useSession, signOut } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { Order } from '@/src/types/order';
import { CartItem } from '@/src/types/cart';

function UserProfileContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      const loginStatus = searchParams.get('login');
      if (loginStatus === 'success') {
        Swal.fire({
          icon: 'success',
          title: '🎉 Login Successful!',
          text: `Welcome back, ${session.user?.name || 'User'}!`,
          confirmButtonColor: '#06b6d4',
          timer: 3000,
          timerProgressBar: true,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
        }).then(() => {
          router.replace('/profile', { scroll: false });
        });
      }
    }
  }, [status, session, router, searchParams]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        const allOrders = Array.isArray(data) ? data : data.orders || [];

        const successfulOrders = allOrders.filter(
          (order: Order) => order.status === 'success' || order.status === 'paid'
        );

        setOrders(successfulOrders);
      } catch (error) {
        console.error('Failed to fetch orders', error);
        Swal.fire('Error', 'Failed to load orders', 'error');
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-red-600 font-medium">
          You must be logged in to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 ">
      <div className="max-w-7xl px-5 mx-auto">

        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white mb-10 overflow-hidden relative">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            {session.user?.image ? (
              <div className="w-32 h-32 md:w-40 md:h-40 relative mb-6 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'Profile'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-6xl font-bold mb-6">
                {session.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              {session.user?.name || 'User'}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              {session.user?.email}
            </p>

            <button
              onClick={async () => {
                await signOut({ redirect: false });
                Swal.fire({
                  icon: 'info',
                  title: '👋 Logged Out',
                  text: 'You have been successfully logged out.',
                  confirmButtonColor: '#06b6d4',
                }).then(() => {
                  window.location.href = '/';
                });
              }}
              className="bg-white text-cyan-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ===== Order History Section ===== */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="text-cyan-600">🛍️</span> Order History
          </h2>

          {loadingOrders ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-cyan-600"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-2xl text-gray-500 mb-4">No orders yet</p>
              <p className="text-gray-600">When you place an order, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-5">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                      <div>
                        <p className="text-lg font-bold">Transaction ID: {order.transactionId}</p>
                        <p className="text-sm opacity-90">
                          Paid on: {order.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm">
                        ✓ Payment Successful
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="grid gap-4">
                      {order.cartItems.map((item: CartItem, index: number) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 relative flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="rounded-lg object-cover shadow-sm"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-bold text-lg text-cyan-600 text-right sm:text-left">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          Total: ৳{order.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserProfile() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600"></div>
            <p className="mt-6 text-xl text-gray-700">Loading your profile...</p>
          </div>
        </div>
      }
    >
      <UserProfileContent />
    </Suspense>
  );
}