import { PaginationInputModel } from '../input/pagination.input.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class PaginationOutputModel<T> {
  @ApiProperty({ isArray: true })
  @IsArray()
  readonly data: T[];

  @ApiProperty({ default: 1 })
  readonly page: number;

  @ApiProperty({ default: 10 })
  readonly limit: number;

  @ApiProperty()
  readonly totalCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
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
