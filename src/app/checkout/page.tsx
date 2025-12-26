'use client';

import { useCartContext } from '@/src/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const { cart, getTotalPrice } = useCartContext(); 
  const router = useRouter();
  const { data: session } = useSession();

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    postcode: '', 
  });

  const [isLoading, setIsLoading] = useState(false);

  // Auto-fill from session
  useEffect(() => {
    if (session?.user) {
      setShippingInfo(prev => ({
        ...prev,
        name: session.user?.name || '',
        email: session.user?.email || '',
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart.length) {
      Swal.fire('Your cart is empty!', '', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/payment/init', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart,          
          shippingInfo,
          totalAmount: getTotalPrice(),
        }),
      });

      const data = await res.json();
      console.log(data)
      if (res.ok && data.success && data.paymentUrl) {
        // SSLCommerz hosted page-এ redirect
        window.location.href = data.paymentUrl;
      } else {
        Swal.fire('Payment Initiation Failed', data.message || 'Try again', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Something went wrong!', 'Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <div className="mb-6">
        <Link
          href="/cart"
          className="text-cyan-600 font-medium hover:underline flex items-center gap-2"
        >
          ← Back to Cart
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Order Summary */}
      <div className="mb-6 border p-4 rounded-lg bg-gray-50">
        <h2 className="font-semibold mb-3">Order Summary</h2>
       {cart.map(item => (
  <div 
    key={item.id}  
    className="flex justify-between mb-2"
  >
    <span>{item.name} × {item.quantity}</span>
    <span>৳{(item.price * item.quantity).toFixed(2)}</span>
  </div>
))}
        <hr className="my-3" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>৳{getTotalPrice().toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={shippingInfo.name}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
          disabled={isLoading}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={shippingInfo.email}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
          disabled={isLoading}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={shippingInfo.phone}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
          disabled={isLoading}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingInfo.address}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
          disabled={isLoading}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingInfo.city}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cyan-600 text-white py-4 rounded-lg font-semibold hover:bg-cyan-700 transition disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  );
}