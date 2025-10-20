// src/config/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

let client: QueryClient | null = null;

export const getQueryClient = () => {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60 * 3,
          gcTime: 1000 * 60 * 10,
        },
      },
    });
  }
  return client;
};
