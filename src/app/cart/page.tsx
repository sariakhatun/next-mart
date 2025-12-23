'use client';

import { useCartContext } from '@/src/context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCartContext();
  const router = useRouter();

  if (!cart.length)
    return <p className="min-h-screen flex items-center justify-center mt-20 text-gray-500 text-lg">Your cart is empty.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>

      <div className="space-y-6">
        {cart.map((item) => {
          const price = item.discount
            ? Math.round(item.price - (item.price * item.discount) / 100)
            : item.price;

          return (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center gap-4 md:gap-6 border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="w-28 h-28 relative flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 w-full">
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <p className="text-gray-500 mt-1">৳{price.toLocaleString()}</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock)}
                    disabled={item.quantity <= 1}
                    className={`px-3 py-1 rounded-lg border ${
                      item.quantity <= 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white hover:bg-gray-50'
                    } transition-colors`}
                  >
                    -
                  </button>

                  <span className="px-3 py-1 border rounded-lg bg-gray-50 w-12 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)}
                    disabled={item.quantity >= item.stock}
                    className={`px-3 py-1 rounded-lg border ${
                      item.quantity >= item.stock
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white hover:bg-gray-50'
                    } transition-colors`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Remove Button */}
              <div className="flex-shrink-0 mt-3 md:mt-0">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 font-medium hover:text-red-800 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Price */}
      <div className="mt-8 text-right flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Total: ৳{getTotalPrice().toLocaleString()}
        </h2>

        {/* Checkout Button */}
        {cart.length > 0 && (
          <button
            onClick={() => router.push('/checkout')}
            className="bg-cyan-600 mb-4 text-white py-3 px-6 rounded-lg font-semibold hover:bg-cyan-700 transition"
          >
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
}
