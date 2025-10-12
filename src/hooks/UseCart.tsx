// src/hooks/useCart.ts
import { useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '@/stores/cartStore';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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

  const queryClient = useQueryClient();
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
