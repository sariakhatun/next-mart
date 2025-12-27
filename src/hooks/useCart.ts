'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CartItem } from '../types/cart';
import { Product } from '../types/product';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  const userEmail = session?.user?.email;

  const fetchCart = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/cart?userEmail=${userEmail}`);
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart', err);
      setCart([]);
    }
  };

  useEffect(() => {
    if (!userEmail) return;

    const getCart = async () => {
      await fetchCart();
    };

    getCart();
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
      fetchCart();
      router.push('/cart');
    }
  };

  const removeFromCart = async (productId: number | string) => {
    if (!userEmail) return;
    await fetch(`/api/cart?userEmail=${userEmail}&productId=${productId}`, { method: 'DELETE' });
    fetchCart();
  };

  const updateQuantity = async (productId: number | string, newQuantity: number, stock: number) => {
    if (!userEmail) return;

    setCart(prev =>
      prev.map(item =>
        String(item.id) === String(productId)
          ? { ...item, quantity: Math.min(newQuantity, stock) }
          : item
      )
    );

    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, productId: String(productId), quantity: Math.min(newQuantity, stock) }),
      });
    } catch (err) {
      console.error(err);
      fetchCart(); 
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
