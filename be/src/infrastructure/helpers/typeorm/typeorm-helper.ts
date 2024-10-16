import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TClass } from '../../types';

@Injectable()
export class TypeOrmHelper {
  constructor(private dataSource: DataSource) {}

  validateFieldInEntity(EntityClass: TClass, field: string): string | null {
    const keys = this.dataSource.getMetadata(EntityClass).propertiesMap;

    const isOrderByExists = Object.keys(keys).some((key) => key === field);

    if (!isOrderByExists) {
      return null;
    }

    return field;
  }
}
