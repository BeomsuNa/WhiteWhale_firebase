// src/stores/cartStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CartProduct, FirestoreCartItem } from '@/lib/product';
import { getAuth, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface CartState {
  cart: FirestoreCartItem[];
  isLoading: boolean;
  user: User | null;
  fetchCart: () => Promise<void>;
  addToCart: (product: FirestoreCartItem, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

// 🔥 Firestore I/O 함수
const fetchCartFromFirestore = async (
  user: User,
): Promise<FirestoreCartItem[]> => {
  const cartRef = doc(db, 'Carts', user?.uid);
  const cartDoc = await getDoc(cartRef);
  if (!cartDoc.exists()) return [];
  const rawCart = cartDoc.data().cart || [];
  return rawCart.map((item: any) => ({
    ...item,
    quantity: item.quantity ?? 1,
  }));
};

const updateCartToFirestore = async (user: User, cart: FirestoreCartItem[]) => {
  if (!user) {
    alert('⚠️ 로그인되지 않은 상태에서 장바구니를 업데이트하려 했습니다.');
    return;
  }
  try {
    const cartRef = doc(db, 'Carts', user.uid);
    const cartSnap = await getDoc(cartRef);
    if (!cartSnap.exists()) {
      await setDoc(cartRef, { cart }, { merge: true });
    } else {
      await setDoc(cartRef, { cart }, { merge: true });
    }
  } catch (error) {
    alert('파이어db 오류');
  }
};

export const useCartStore = create<CartState>()((set, get) => ({
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
    let newCart: FirestoreCartItem[];

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
    console.log('현재 카트상태는?', newCart);
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

    const newCart = get().cart.map(p => (p.id === id ? { ...p, quantity } : p));
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
}));
