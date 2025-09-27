import React from 'react';

import { useProducts } from './UseFetchInfinityProducts';
import { Alert } from '@/components/ui/alert';
import { useQueryClient } from '@tanstack/react-query';

export const usePreFetchProduct = () => {
  const queryClient = useQueryClient();

  const preFetchData = async () => {
    try {
      await queryClient.prefetchQuery({
        queryKey: ['products'],
        queryFn: useProducts,
      });
    } catch (error) {
      throw new Error('에러 발생');
    }
  };
  return { preFetchData };
};
