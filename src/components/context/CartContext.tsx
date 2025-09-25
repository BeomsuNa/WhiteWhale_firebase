import { getAuth } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { CartProduct } from '@/lib/product';
import { db } from '@/config/firebase';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// 장바구니 불러오기
export const fetchCart = async (): Promise<CartProduct[]> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return [];
  const cartRef = doc(db, 'Carts', user.uid);
  const cartDoc = await getDoc(cartRef);
  if (!cartDoc.exists()) return [];

  const rawCart = cartDoc.data().cart || [];
  return rawCart.map((item: any) => ({
    id: item.id, // Firestore에 저장한 id 필드
    productName: item.productName,
    productPrice: item.productPrice,
    productCategory: item.productCategory,
    imageUrl: item.imageUrl,
    productQuantity: item.productQuantity,
  })) as CartProduct[];
};

// 장바구니 업데이트
export const updateCart = async (cart: CartProduct[]) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('로그인이 필요합니다');

  const cartRef = doc(db, 'Carts', user.uid);
  await setDoc(cartRef, cart);
};

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data: cart = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    staleTime: 1000 * 60,
  });

  const mutation = useMutation({
    mutationFn: (newCart: CartProduct[]) => updateCart(newCart),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
  });

  const addToCart = (product: CartProduct, quantity: number = 1) => {
    // 재고가 0이면 매진 처리
    if (product.productPrice <= 0) {
      alert('매진된 상품입니다.');
      return;
    }

    const existing = cart.find(p => p.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(p =>
        p.id === product.id
          ? { ...p, quantity: p.productQuantity + quantity }
          : p,
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
    }

    mutation.mutate(newCart);
  };

  // 상품 제거
  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(p => p.id !== productId);
    mutation.mutate(newCart);
  };

  // 수량 변경
  const updateCartQuantity = (productId: string, quantity: number) => {
    const newCart = cart.map(p =>
      p.id === productId ? { ...p, quantity } : p,
    );
    mutation.mutate(newCart);
  };

  // 장바구니 비우기
  const clearCart = () => {
    mutation.mutate([]);
  };

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  };
};
