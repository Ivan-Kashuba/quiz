import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './api/domain/User';
import { UsersController } from './api/users.controller';
import { UsersQueryRepository } from './api/infrastructure/users.query.repository';
import { UsersRepository } from './api/infrastructure/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersQueryRepository, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
