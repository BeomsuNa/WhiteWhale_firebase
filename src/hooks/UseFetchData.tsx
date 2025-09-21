import { useQuery, useInfiniteQuery } from 'react-query';
import { FetchProducts } from './UseFetchInfinityProducts';
import { FetchProductsResult, ProductCard } from '@/lib/product';
import { fetchProductCardData } from './FetchProductCardData';

export const useFetchInfiniteProducts = () => {
  return useInfiniteQuery<FetchProductsResult>('products', FetchProducts, {
    getNextPageParam: lastPage => lastPage.nextPage || undefined,
  });
};

export const useFetchProductCardData = (sortOption: string) => {
  return useQuery<ProductCard[]>(['productCardData', sortOption], () =>
    fetchProductCardData(sortOption),
  );
};
