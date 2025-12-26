'use client';

import { useSession, signOut } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { Order } from '@/src/types/order';
import { CartItem } from '@/src/types/cart';


/* ================= CONTENT ================= */

function UserProfileContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  /* ===== Login success toast ===== */
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

  /* ===== Fetch Orders ===== */
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();

        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [status]);

  /* ===== States ===== */
  if (status === 'loading') {
    return (
      <p className="text-center mt-20 text-xl">
        Loading your profile...
      </p>
    );
  }

  if (!session) {
    return (
      <p className="text-center mt-20 text-xl text-red-600">
        You must be logged in to view this page.
      </p>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="my-8 max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-2xl">
      {/* ===== User Info ===== */}
      <div className="flex flex-col items-center mb-10">
        {session.user?.image && (
          <div className="w-32 h-32 relative mb-6 rounded-full overflow-hidden border-4 border-cyan-600 shadow-lg">
            <Image
              src={session.user.image}
              alt={session.user.name || 'Profile Picture'}
              fill
              className="object-cover"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {session.user?.name}
        </h1>
        <p className="text-xl text-gray-600">
          {session.user?.email}
        </p>
      </div>

      {/* ===== Logout Button ===== */}
      <div className="flex justify-center mb-10">
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
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl"
        >
          Logout
        </button>
      </div>

      {/* ===== Order History ===== */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Order History
        </h2>

        {loadingOrders ? (
          <p className="text-center py-6">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No orders found yet.
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div
                key={order._id}
                className="border rounded-xl p-6 bg-white shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold">
                      Transaction ID: {order.transactionId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Paid at:{' '}
                      {order.paidAt
                        ? new Date(order.paidAt).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
    ${order.status === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                      }
  `}
                  >
                    {order.status}
                  </span>

                </div>

                {/* Cart Items */}
                <div className="divide-y">
                  {order.cartItems.map((item: CartItem, index: number) => (
                    <div key={index} className="flex justify-between py-3">
                      <div className="flex gap-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="font-semibold">
                        ৳ {item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>


                {/* Footer */}
                <div className="flex justify-between mt-4 border-t pt-4">
                  <p className="text-sm text-gray-600">
                    Payment: {order.paymentMethod}
                  </p>
                  <p className="text-lg font-bold">
                    Total: ৳ {order.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= SUSPENSE ================= */

export default function UserProfile() {
  return (
    <Suspense
      fallback={
        <div className="text-center mt-20 text-xl">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      }
    >
      <UserProfileContent />
    </Suspense>
  );
}
