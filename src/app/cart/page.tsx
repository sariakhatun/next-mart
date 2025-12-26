'use client';

import { useCartContext } from '@/src/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartContext();
  const router = useRouter();
  const [voucherCode, setVoucherCode] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(cart.map(item => item.id)));

  const shippingFee = 140;

 
  const getSelectedSubtotal = () => {
    return cart
      .filter(item => selectedItems.has(item.id))
      .reduce((sum, item) => {
        const price = item.discount
          ? Math.round(item.price - (item.price * item.discount) / 100)
          : item.price;
        return sum + price * item.quantity;
      }, 0);
  };

  const selectedSubtotal = getSelectedSubtotal();
  const total = selectedSubtotal + shippingFee;

  const selectedCount = selectedItems.size;

  if (!cart.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-2xl text-gray-500 mb-4">Your cart is empty.</p>
          <Link href="/products" className="text-cyan-600 hover:underline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const toggleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map(item => item.id)));
    }
  };

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const deleteSelected = () => {
    selectedItems.forEach(id => removeFromCart(id));
    setSelectedItems(new Set());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2">
          {/* Select All Header */}
          <div className="flex items-center justify-between mb-4 bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.size === cart.length && cart.length > 0}
                onChange={toggleSelectAll}
                className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500"
              />
              <span className="text-sm font-medium">
                Select All ({cart.length} item{cart.length > 1 ? 's' : ''})
              </span>
            </label>
            {selectedItems.size > 0 && (
              <button
                onClick={deleteSelected}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item) => {
              const discountedPrice = item.discount
                ? Math.round(item.price - (item.price * item.discount) / 100)
                : item.price;

              const isSelected = selectedItems.has(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItem(item.id)}
                      className="mt-1 w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500"
                    />

                    <div className="w-20 h-20 relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-500">No Brand</p>

                      <div className="flex items-center gap-3 mt-2">
                        {item.discount ? (
                          <>
                            <span className="text-sm line-through text-gray-400">৳{item.price}</span>
                            <span className="text-lg font-bold text-orange-600">৳{discountedPrice}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">৳{discountedPrice}</span>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-600 p-1 transition-colors flex items-center justify-center "
                        title="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg> <span className='text-sm'>Remove</span>
                      </button>
                      <Link
                        href={`/products/${item.id}`}
                        className="text-cyan-600 hover:text-cyan-700 p-1 transition-colors text-sm font-medium flex items-center gap-1"
                        title="View details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 text-lg">
              <div className="flex justify-between">
                <span>Subtotal ({selectedCount} item{selectedCount > 1 ? 's' : ''})</span>
                <span>৳{selectedSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>৳{shippingFee}</span>
              </div>
            </div>

            {/* Voucher */}
            <div className="mt-6 flex gap-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Enter Voucher Code (Optional)"
                className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-cyan-700">
                Apply
              </button>
            </div>

            <div className="border-t mt-6 pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-cyan-600">৳{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              disabled={selectedCount === 0}
              className={`w-full mt-6 py-4 rounded-lg font-bold text-lg transition shadow-lg ${
                selectedCount === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-cyan-500 text-white hover:bg-cyan-600'
              }`}
            >
              Proceed to Checkout ({selectedCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}