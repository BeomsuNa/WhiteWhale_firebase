// src/hooks/useCart.ts

import { useCartStore } from '@/stores/cartStore';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getQueryClient } from '@/config/queryClient';

export const useCart = () => {
  const {
    cart,
    isLoading,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCartStore();

  const queryClient = getQueryClient();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) fetchCart();
      else clearCart();
    });
    return () => unsubscribe();
  }, [auth, fetchCart, clearCart]);

  // ✅ React Query 캐시 갱신 (상품 데이터 변경 감지용)
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [cart, queryClient]);

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
