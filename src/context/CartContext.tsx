'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { CartItem } from '../types/cart';
import { Product } from '../types/product';

interface CartContextProps {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, newQuantity: number, stock: number) => Promise<void>;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const fetchCart = async () => {
    if (!userEmail) {
      setCart([]);
      return;
    }
    const res = await fetch(`/api/cart?userEmail=${userEmail}`);
    const data = await res.json();
    setCart(Array.isArray(data) ? data : []); // 🔒 safety
  };

  useEffect(() => {
    fetchCart();
  }, [userEmail]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!userEmail) {
      alert('Please login first!');
      return;
    }

    const cartItem: CartItem = {
      ...product,
      quantity,
      userEmail,
    };

    // 🔥 Optimistic update (navbar instantly update)
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, cartItem];
    });

    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItem),
    });
  };

  const removeFromCart = async (productId: number) => {
    if (!userEmail) return;

    setCart(prev => prev.filter(item => item.id !== productId));

    await fetch(
      `/api/cart?userEmail=${userEmail}&productId=${productId}`,
      { method: 'DELETE' }
    );
  };

  const updateQuantity = async (productId: number, newQuantity: number, stock: number) => {
    if (!userEmail) return;

    const finalQty = Math.min(newQuantity, stock);

    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: finalQty } : item
      )
    );

    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, productId, quantity: finalQty }),
    });
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => {
      const price = item.discount
        ? Math.round(item.price - (item.price * item.discount) / 100)
        : item.price;
      return total + price * item.quantity;
    }, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartContext must be used within CartProvider');
  return context;
}
