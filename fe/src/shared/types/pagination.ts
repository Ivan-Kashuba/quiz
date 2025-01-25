export type WithPagination<T> = {
  data: T[];
  page: number;
  limit: number;
  totalCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
