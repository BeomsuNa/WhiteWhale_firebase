import { UploadProduct } from '@/lib/product';
import { fetchProductCardData } from './FetchProductCardData';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useCategoryStore } from '@/stores/categoryStore';

export const useFetchProductCardData = (sortOption: string) => {
  const category = useCategoryStore(s => s.category);
  return useQuery<UploadProduct[]>({
    queryKey: ['productCardData', sortOption, category],
    queryFn: () => fetchProductCardData(sortOption, category),
    staleTime: 1000 * 60 * 3, // 3분 동안 캐싱
    gcTime: 1000 * 60 * 5, // 5분 후에 가비지 컬렉션
  });
};
