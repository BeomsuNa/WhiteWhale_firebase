import FetchProducts from './UseFetchInfinityProducts';
import { UploadProduct } from '@/lib/product';
import { fetchProductCardData } from './FetchProductCardData';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const useFetchProductCardData = (sortOption: string) => {
  return useQuery<UploadProduct[]>({
    queryKey: ['productCardData', sortOption],
    queryFn: () => fetchProductCardData(sortOption),
  });
};
