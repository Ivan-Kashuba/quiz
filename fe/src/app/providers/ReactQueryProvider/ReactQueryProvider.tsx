import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
      // @ts-ignore
      onError: (error, query) => {
        console.log('error:', error);
        console.log('query:', query);
        queryClient.resetQueries(query.queryKey);
      },
    },
  },
});

export const ReactQueryProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
