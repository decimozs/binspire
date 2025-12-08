import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
  type UseMutationResult,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export {
  useQueryClient,
  queryClient,
  QueryClient,
  ReactQueryDevtools,
  queryOptions,
  useSuspenseQuery,
  useMutation,
  type UseMutationResult,
};
