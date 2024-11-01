import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmHelper } from '../helpers/typeorm/typeorm-helper';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [TypeOrmHelper],
  exports: [CqrsModule, TypeOrmHelper],
})
export class SharedModule {}
