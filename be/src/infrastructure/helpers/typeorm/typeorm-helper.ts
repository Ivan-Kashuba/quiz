import { getMetadataArgsStorage } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { TClass } from '../../types';

export class TypeOrmHelper {
  static validateFieldInEntity(entityClass: TClass, field: string) {
    const columns = getMetadataArgsStorage().columns;

    // TODO Implement logic of finding entity field
    // const isOrderByExists = columns.some(
    //   (column) =>
    //     column.target === entityClass && column.propertyName === field,
    // );

    const isOrderByExists = true;

    if (!isOrderByExists) {
      throw new BadRequestException(`${field} field is incorrect`);
    }
  }
}
