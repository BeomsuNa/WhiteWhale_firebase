import FetchProducts from './UseFetchInfinityProducts';
import { UploadProduct } from '@/lib/product';
import { fetchProductCardData } from './FetchProductCardData';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const useFetchProductCardData = (sortOption: string) => {
  return useQuery<UploadProduct[]>({
    queryKey: ['productCardData', sortOption],
    queryFn: () => fetchProductCardData(sortOption),
    staleTime: 1000 * 60 * 3, // 3분 동안 캐싱
    gcTime: 1000 * 60 * 5, // 5분 후에 가비지 컬렉션
  });
};
