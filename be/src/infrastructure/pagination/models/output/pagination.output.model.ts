import { IsArray } from 'class-validator';
import { PaginationInputModel } from '../input/pagination.input.model';

export class PaginationOutputModel<T> {
  @IsArray()
  data: T[];

  readonly page: number;

  readonly limit: number;

  readonly totalCount: number;

  readonly pageCount: number;

  readonly hasPreviousPage: boolean;

  readonly hasNextPage: boolean;

  constructor(
    data: T[],
    totalCount: number,
    paginationInfo: PaginationInputModel,
  ) {
    this.data = data;
    this.page = paginationInfo.pageNumber;
    this.limit = paginationInfo.limit;
    this.totalCount = totalCount;
    this.pageCount = Math.ceil(this.totalCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
