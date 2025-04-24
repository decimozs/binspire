import { useMemo } from "react";

export function usePagination<T>(data: T[], page: number, pageSize: number) {
  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  return {
    paginatedData,
    totalPages,
    safePage,
    totalItems,
  };
}
