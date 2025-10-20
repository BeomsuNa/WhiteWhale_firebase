import { UploadProduct } from '@/lib/product';
import { fetchProductCardData } from './FetchProductCardData';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useCategoryStore } from '@/stores/categoryStore';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const useFetchProductCardData = (sortOption: string) => {
  const category = useCategoryStore(s => s.category);
  return useQuery<UploadProduct[]>({
    queryKey: ['productCardData', sortOption, category],
    queryFn: () => fetchProductCardData(sortOption, category),
    staleTime: 1000 * 60 * 3, // 3분 동안 캐싱
    gcTime: 1000 * 60 * 5, // 5분 후에 가비지 컬렉션
  });
};

export async function fetchProductslimit({ page = 1, limitsize = 10 }) {
  const productsRef = collection(db, 'Product');
  const q = query(productsRef, orderBy('createdAt'), limit(limitsize));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
