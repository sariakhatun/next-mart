'use client';

import { useSession, signOut } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';  // এই দুটো যোগ করো
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import Image from 'next/image';

interface Order {
  id: string;
  product: string;
  amount: number;
  date: string;
}

export default function UserProfile() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Mock order history
  const orders: Order[] = [
    { id: '1', product: 'NextMart T-shirt', amount: 25, date: '2025-12-10' },
    { id: '2', product: 'NextMart Shoes', amount: 50, date: '2025-12-15' },
    { id: '3', product: 'NextMart Backpack', amount: 35, date: '2025-12-20' },
  ];

  useEffect(() => {
    const loginStatus = searchParams.get('login');

    // শুধু লগিনের পর প্রথমবার alert দেখাবে
    if (loginStatus === 'success' && status === 'authenticated' && session) {
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
        // Alert বন্ধ হলে URL থেকে ?login=success সরিয়ে দাও
        router.replace('/profile', { scroll: false });
      });
    }
  }, [status, session, searchParams, router]);

  if (status === 'loading') {
    return <p className="text-center mt-20 text-xl">Loading your profile...</p>;
  }

  if (!session) {
    return <p className="text-center mt-20 text-xl text-red-600">You must be logged in to view this page.</p>;
  }

  return (
    <div className="my-8 max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-2xl">
      {/* User Info */}
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{session.user?.name}</h1>
        <p className="text-xl text-gray-600">{session.user?.email}</p>
      </div>

      {/* Logout Button */}
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
                // optional redirect after alert
                window.location.href = '/'; 
              });
            }}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
        >
          Logout
        </button>
      </div>

      {/* Order History */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No orders found yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="py-4 px-4 font-semibold">Order ID</th>
                  <th className="py-4 px-4 font-semibold">Product</th>
                  <th className="py-4 px-4 font-semibold">Amount ($)</th>
                  <th className="py-4 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-100 transition">
                    <td className="py-4 px-4">#{order.id}</td>
                    <td className="py-4 px-4 font-medium">{order.product}</td>
                    <td className="py-4 px-4">${order.amount}</td>
                    <td className="py-4 px-4 text-gray-600">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}