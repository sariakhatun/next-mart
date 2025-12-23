'use client';

import { useState, useEffect } from 'react';
import { CartItem } from '@/types/cart';
import { Product } from '@/types/product';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  const userEmail = session?.user?.email;

  // fetch cart from MongoDB
  const fetchCart = async () => {
    if (!userEmail) return;
    const res = await fetch(`/api/cart?userEmail=${userEmail}`);
    const data = await res.json();
    setCart(data);
  };

  useEffect(() => {
    fetchCart();
  }, [userEmail]);

  const addToCart = async (product: Product) => {
    if (!userEmail) {
      alert('Please login first!');
      return;
    }

    const cartItem: CartItem = { ...product, quantity: 1, userEmail };
    const res = await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify(cartItem),
    });
    if (res.ok) {
      alert('✅ Product added to cart!');
      fetchCart(); // refresh cart
      router.push('/cart'); // redirect to cart page
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!userEmail) return;
    await fetch(`/api/cart?userEmail=${userEmail}&productId=${productId}`, { method: 'DELETE' });
    fetchCart();
  };

// updateQuantity already does optimistic updates
const updateQuantity = async (productId: number, newQuantity: number, stock: number) => {
  if (!userEmail) return;

  // Optimistic update for UI
  setCart(prev => prev.map(item => item.id === productId
    ? { ...item, quantity: Math.min(newQuantity, stock) }
    : item
  ));

  // Sync with MongoDB
  try {
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, productId, quantity: Math.min(newQuantity, stock) }),
    });
  } catch (err) {
    console.error(err);
    fetchCart(); // fallback if API fails
  }
};



  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.discount ? Math.round(item.price - (item.price * item.discount) / 100) : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  return { cart, addToCart, removeFromCart, updateQuantity, getTotalPrice };
}
