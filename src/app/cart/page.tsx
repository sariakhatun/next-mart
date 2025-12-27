// app/cart/page.tsx
'use client';

import { useCartContext } from '@/src/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCartContext();
  const router = useRouter();
  const [voucherCode, setVoucherCode] = useState('');

  const shippingFee = 140;

  const getSubtotal = () => {
    return cart.reduce((sum, item) => {
      const price = item.discount
        ? Math.round(item.price - (item.price * item.discount) / 100)
        : item.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const subtotal = getSubtotal();
  const total = subtotal + shippingFee;
  const itemCount = cart.length;

  if (!cart.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-2xl text-gray-500 mb-4">Your cart is empty.</p>
          <Link href="/products" className="text-cyan-600 hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-8 mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">Shopping Cart ({itemCount} {itemCount > 1 ? 'items' : 'item'})</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => {
              const discountedPrice = item.discount
                ? Math.round(item.price - (item.price * item.discount) / 100)
                : item.price;

              const itemTotal = discountedPrice * item.quantity;

              return (
                <div
                  key={item.id}
                  className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-24 h-24 relative flex-shrink-0 mx-auto sm:mx-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 w-full">
                      <h3 className="font-medium text-lg mb-1 text-center sm:text-left">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2 text-center sm:text-left">No Brand</p>

                      <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                        {item.discount ? (
                          <>
                            <span className="text-sm line-through text-gray-400">
                              ৳{item.price}
                            </span>
                            <span className="text-lg font-bold text-orange-600">
                              ৳{discountedPrice}
                            </span>
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                              -{item.discount}%
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">৳{discountedPrice}</span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                        <div className="flex items-center gap-3 border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock)}
                            disabled={item.quantity <= 1}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                          >
                            −
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)}
                            disabled={item.quantity >= item.stock}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= item.stock && (
                        <p className="text-xs text-orange-600 mt-2 text-center sm:text-left">
                          Maximum stock reached ({item.stock} available)
                        </p>
                      )}
                    </div>

                    {/* Action Buttons + Item Total */}
                    <div className="grid grid-cols-[24px_1fr] gap-x-3 gap-y-3 w-full sm:w-36 mt-4 sm:mt-0">

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="col-span-2 flex items-center gap-3 text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg justify-center sm:justify-start"
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-sm font-medium">Remove</span>
                      </button>

                      {/* Details */}
                      <Link
                        href={`/products/${item.id}`}
                        className="col-span-2 flex items-center gap-3 text-cyan-600 hover:text-cyan-700 p-2 hover:bg-cyan-50 rounded-lg justify-center sm:justify-start"
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
           -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-sm font-medium">Details</span>
                      </Link>

                      {/* Item Total */}
                      <div className="col-span-2 pt-2 border-t text-center sm:text-left">
                        <p className="text-xs text-gray-500 ml-0 sm:ml-3">Item Total</p>
                        <p className="text-lg font-bold text-cyan-600 leading-tight ml-0 sm:ml-3">
                          ৳{itemTotal.toLocaleString()}
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-gray-50 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 text-base">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Subtotal ({itemCount} {itemCount > 1 ? 'items' : 'item'})
                </span>
                <span className="font-semibold text-lg">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping Fee</span>
                <span className="font-semibold">৳{shippingFee}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-cyan-600">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Voucher */}
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Voucher Code (Optional)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button className="bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Apply
                </button>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full mt-6 py-4 rounded-lg font-bold text-lg transition-all shadow-lg bg-cyan-600 text-white hover:bg-cyan-700 hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center">
              <Link
                href="/products"
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}