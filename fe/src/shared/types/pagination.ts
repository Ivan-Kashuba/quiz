export class WithPagination<T> {
  readonly data: T[];
  readonly page: number;
  readonly limit: number;
  readonly totalCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}
