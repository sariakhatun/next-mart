'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { CartItem } from '../types/cart';
import { Product } from '../types/product';
import Swal from 'sweetalert2';

interface CartContextProps {
  cart: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, newQuantity: number, stock: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  removePurchasedItems: (productIds: string[]) => Promise<void>;

}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const fetchCart = async () => {
    if (!userEmail) {
      setCart([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/cart?userEmail=${userEmail}`);
      const data = await res.json();
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch cart', err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCart();
  }, [userEmail]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!userEmail) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login first to add items to your cart',
        confirmButtonText: 'OK',
      }); return false;
    }

    const cartItem: CartItem = {
      ...product,
      quantity,
      userEmail,
    };

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
    return true;
  };

  const removeFromCart = async (productId: string) => {
  if (!userEmail) return;

  // optimistic UI
  setCart(prev => prev.filter(item => item.id !== productId));

  const res = await fetch(
    `/api/cart?userEmail=${userEmail}&productId=${productId}`,
    { method: 'DELETE' }
  );

  const result = await res.json();

  if (!res.ok || result.deletedCount === 0) {
    console.error('Delete failed, refetching cart');
    fetchCart(); // rollback / sync again
  }
};

  const removePurchasedItems = async (productIds: string[]) => {
  if (!userEmail) return;

  setCart(prev => prev.filter(item => !productIds.includes(item.id)));

  await fetch('/api/cart/remove-multiple', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail, productIds }),
  });
};


  const updateQuantity = async (productId: string, newQuantity: number, stock: number) => {
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


  const clearCart = async () => {
    if (!userEmail) return;

    setCart([]);

    try {

      await fetch(`/api/cart/clear`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail }),
      });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
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
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
         removePurchasedItems
      }}
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