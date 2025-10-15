// src/stores/cartStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CartProduct } from '@/lib/product';
import { getAuth, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface CartState {
  cart: CartProduct[];
  isLoading: boolean;
  user: User | null;
  fetchCart: () => Promise<void>;
  addToCart: (product: CartProduct, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

// 🔥 Firestore I/O 함수
const fetchCartFromFirestore = async (user: User): Promise<CartProduct[]> => {
  const cartRef = doc(db, 'Carts', user.uid);
  const cartDoc = await getDoc(cartRef);
  if (!cartDoc.exists()) return [];
  const rawCart = cartDoc.data().cart || [];
  return rawCart.map((item: any) => ({
    ...item,
    quantity: item.quantity ?? 1,
  }));
};

const updateCartToFirestore = async (user: User, cart: CartProduct[]) => {
  const cartRef = doc(db, 'Carts', user.uid);
  await setDoc(cartRef, { cart });
};

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        isLoading: false,
        user: null,

        fetchCart: async () => {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) return;

          set({ isLoading: true, user });
          const cart = await fetchCartFromFirestore(user);
          set({ cart, isLoading: false });
        },

        addToCart: async (product, quantity = 1) => {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) {
            alert('로그인이 필요합니다.');
            return;
          }

          const existing = get().cart.find(p => p.id === product.id);
          let newCart: CartProduct[];

          if (existing) {
            newCart = get().cart.map(p =>
              p.id === product.id
                ? { ...p, quantity: (p.quantity ?? 0) + quantity }
                : p,
            );
          } else {
            newCart = [...get().cart, { ...product, quantity }];
          }

          set({ cart: newCart });
          await updateCartToFirestore(user, newCart);
        },

        removeFromCart: async id => {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) return;

          const newCart = get().cart.filter(p => p.id !== id);
          set({ cart: newCart });
          await updateCartToFirestore(user, newCart);
        },

        updateQuantity: async (id, quantity) => {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) return;

          const newCart = get().cart.map(p =>
            p.id === id ? { ...p, quantity } : p,
          );
          set({ cart: newCart });
          await updateCartToFirestore(user, newCart);
        },

        clearCart: async () => {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) return;
          set({ cart: [] });
          await updateCartToFirestore(user, []);
        },
      }),
      {
        name: 'cart-storage', // localStorage key
      },
    ),
    { name: 'CartStore' }, // DevTools 이름
  ),
);
