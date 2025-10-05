import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { CartProduct } from '@/lib/product';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 🧩 Firestore에서 장바구니 가져오기
const fetchCart = async (user: User): Promise<CartProduct[]> => {
  const cartRef = doc(db, 'Carts', user.uid);
  const cartDoc = await getDoc(cartRef);
  if (!cartDoc.exists()) return [];

  const rawCart = cartDoc.data().cart || [];
  return rawCart.map((item: any) => ({
    id: item.id,
    productName: item.productName,
    productPrice: item.productPrice,
    productCategory: item.productCategory,
    imageUrl: item.imageUrl,
    productQuantity: item.productQuantity ?? 0,
    quantity: item.quantity ?? 1,
  })) as CartProduct[];
};

// 🧩 Firestore에 장바구니 업데이트
const updateCart = async (user: User, cart: CartProduct[]) => {
  const cartRef = doc(db, 'Carts', user.uid);
  await setDoc(cartRef, { cart }); // 반드시 객체로 감싸야 함!
};

// 🧩 장바구니 훅
export const useCart = () => {
  const queryClient = useQueryClient();
  const auth = getAuth();

  // ✅ 로그인 상태 복원 감시
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // ✅ React Query: user가 있을 때만 실행
  const {
    data: cart = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['cart', user?.uid],
    queryFn: () => fetchCart(user as User),
    enabled: !!user, // user가 null일 땐 실행 안 함
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });

  // ✅ Firestore & Query 캐시 갱신용 Mutation
  const mutation = useMutation({
    mutationFn: (newCart: CartProduct[]) => updateCart(user as User, newCart),
    onSuccess: async () => {
      // 서버와 동기화 후 관련 데이터 갱신
      await queryClient.invalidateQueries({ queryKey: ['cart', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['productCardData'] });
    },
  });

  // ✅ 장바구니 관련 함수
  const addToCart = (product: CartProduct, quantity: number = 1) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    const existing = cart.find(p => p.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(p =>
        p.id === product.id
          ? { ...p, quantity: (p.quantity ?? 0) + quantity }
          : p,
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
    }

    mutation.mutate(newCart);
  };

  const removeFromCart = (productId: string) => {
    if (!user) return;
    const newCart = cart.filter(p => p.id !== productId);
    mutation.mutate(newCart);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (!user) return;
    const newCart = cart.map(p =>
      p.id === productId ? { ...p, quantity } : p,
    );
    mutation.mutate(newCart);
  };

  const clearCart = () => {
    if (!user) return;
    mutation.mutate([]);
  };

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    refetch, // 필요 시 강제 재조회 가능
  };
};
