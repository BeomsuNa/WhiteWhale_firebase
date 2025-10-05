import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Product } from '@/lib/product';
import { mapDocToProduct } from '../Order/productUtill';
import { useQuery } from '@tanstack/react-query';

// 모든 상품 불러오기 (페이지네이션 X)
export const FetchAllProducts = async (): Promise<Product[]> => {
  const productsQuery = query(
    collection(db, 'Product'),
    orderBy('createdAt', 'desc'),
  );

  const querySnapshot = await getDocs(productsQuery);
  return querySnapshot.docs.map(mapDocToProduct);
};

export function useFetchAllProducts() {
  return useQuery({
    queryKey: ['all-products'],
    queryFn: FetchAllProducts,
    staleTime: 1000 * 60 * 3, // 무한 캐싱 (자동 갱신 없음)
  });
}
