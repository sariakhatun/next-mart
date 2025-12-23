'use client';

import { useCartContext } from '@/src/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const { cart, getTotalPrice, setCart } = useCartContext(); // Add setCart if you want to clear cart
  const router = useRouter();
  const { data: session } = useSession();

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: '',
  });

  // Auto-fill name and email from session
  useEffect(() => {
    if (session?.user) {
      setShippingInfo(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
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

    // 1. Send order data to your backend to create an SSLCommerz payment session
    const res = await fetch('/api/sslcommerz/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart,
        shippingInfo,
        totalAmount: getTotalPrice(),
      }),
    });

    const data = await res.json();

    if (data && data.GatewayPageURL) {
      // Redirect to SSLCommerz hosted payment page
      window.location.href = data.GatewayPageURL;
    } else {
      Swal.fire('Payment Initialization Failed', '', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      {/* Back to Cart Link */}
      <div className="mb-6">
        <Link
          href="/cart"
          className="text-cyan-600 font-medium hover:underline flex items-center gap-2"
        >
          &#8592; Back to Cart
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Order Summary */}
      <div className="mb-6 border p-4 rounded-lg">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>৳{item.price * item.quantity}</span>
          </div>
        ))}
        <hr className="my-2" />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>৳{getTotalPrice()}</span>
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
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={shippingInfo.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={shippingInfo.phone}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingInfo.address}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingInfo.city}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
}
