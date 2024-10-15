import { Order } from '../../enums/order';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationInputModel {
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly pageNumber?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly limit?: number = 10;

  @IsString()
  @IsOptional()
  readonly orderBy?: string = 'createdAt';

  get skip(): number {
    return (this.pageNumber - 1) * this.limit;
  }
}
