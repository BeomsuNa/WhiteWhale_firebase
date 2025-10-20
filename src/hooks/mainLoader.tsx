import FetchProducts from './UseFetchInfinityProducts';
import { fetchProductCardData } from './FetchProductCardData';

import { getQueryClient } from '@/config/queryClient';
import { fetchProductslimit } from './UseFetchData';

export async function mainLoader() {
  const queryClient = getQueryClient();
  const start = performance.now();

  await queryClient.prefetchQuery({
    queryKey: ['mainProducts'],
    queryFn: () => fetchProductslimit({ page: 1, limitsize: 10 }),
  });

  const end = performance.now();
  console.log(`🔥 Loader Prefetch Duration: ${(end - start).toFixed(2)} ms`);

  return null;
}
