import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbConfigService } from './db-config-service';

@Module({
  imports: [TypeOrmModule.forRoot(DbConfigService.getTypeOrmConfig())],
})
export class DatabaseModule {}
